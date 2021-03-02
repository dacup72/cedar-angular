import { Component, Inject, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cylinder, emptyCylinder } from '@cedar-all/core-data';
import { ComponentGas } from '@cedar-angular/api-interfaces';
import { cloneDeep } from 'lodash';
import { FormControl, Validators, FormGroup, ValidatorFn, FormBuilder, FormArray } from '@angular/forms';
import { CylinderValidators } from './cylinder-validators';

export interface DialogData {
  cylinder: Cylinder;
}

@Component({
  selector: 'cylinder-tracker-edit-cylinder-dialog',
  templateUrl: './edit-cylinder-dialog.component.html',
  styleUrls: ['./edit-cylinder-dialog.component.scss']
})
export class EditCylinderDialogComponent {
  currentCylinder: Cylinder;
  cylinderForm: FormGroup;
  origionalTitle: string;
  commonGasCodes = [ 'NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2'];
  uncommonGasCodes = ['N2O', 'PPN', 'CH4', 'HE', 'H2S'];
  balCodes = ['BALN', 'BALA'];
  otherCodes = ['APPVD', 'AIR', 'SRM', 'NTRM', 'GMIS', 'RGM', 'PRM', 'ZERO'];
  measurementTypes = ['ppm', 'ppb', '%'];
  showMoreGases = false;
  showMoreOtherGases = false;
  balCodeSelected = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<EditCylinderDialogComponent>, fb: FormBuilder) {
    this.currentCylinder = !data.cylinder ? cloneDeep(emptyCylinder) : cloneDeep(data.cylinder);
    this.origionalTitle = !data.cylinder ? '' : data.cylinder.cylinderID;
    
    this.cylinderForm = fb.group({
      cylinderID: [this.currentCylinder.cylinderID, 
        Validators.required,
      ],
      expirationDate: [this.currentCylinder.expirationDate, 
        Validators.required,
      ],
      vendorID: [this.currentCylinder.vendorID, 
        Validators.required,
      ],
      epaGasTypeCodes: fb.array([]),
      componentGases: fb.array([]),
      certificationImage: [this.currentCylinder.certificationImage, 
        Validators.required,
      ],
      state: 'spare',
      hasBeenUsedForQA: false,
      "createdByPartialEdit": false,
      "editHistory": "<history goes here />",
      "errorList": fb.array([])
    })

    this.currentCylinder.epaGasTypeCodes.forEach(c => this.addEPAGasTypeCode(c));
    this.currentCylinder.componentGases.forEach(g => this.addComponentGas(g.qaGasDefCode, g.epaGasCode, g.gasConcentration, g.uom));

    // Add BALN as default if adding new cylinder
    if (!this.currentCylinder.id) {
      this.addEPAGasTypeCode('BALN');
    }
    this.isBalCodeSelected();

  }

  get cylinderID() {
    return this.cylinderForm.get('cylinderID');
  }
  get expirationDate() {
    return this.cylinderForm.get('expirationDate');
  }
  get vendorID() {
    return this.cylinderForm.get('vendorID');
  }
  get epaGasTypeCodes() {
    return (this.cylinderForm.get('epaGasTypeCodes') as FormArray);
  }
  get componentGases() {
    return (this.cylinderForm.get('componentGases') as FormArray);
  }
  get certificationImage() {
    return this.cylinderForm.get('certificationImage');
  }

  addEPAGasTypeCode(gasCode: string) {
    this.epaGasTypeCodes.push(new FormControl(gasCode));
  }

  removeEPAGasTypeCodes(gasCodes: string[]) {
    const matchedFormControls = this.epaGasTypeCodes.controls.filter(gas => gasCodes.includes(gas.value));
    matchedFormControls.forEach(g => {
      const index = this.epaGasTypeCodes.controls.indexOf(g);
      this.epaGasTypeCodes.removeAt(index);
    });
  }

  addComponentGas(qaGasDefCode: string, epaGasCode = qaGasDefCode, gasConc = 0, uom = '') {
    if(!this.balCodes.includes(qaGasDefCode) && !this.otherCodes.includes(qaGasDefCode)) {
      this.componentGases.push(new FormGroup({
        qaGasDefCode: new FormControl(qaGasDefCode,
          Validators.required,
        ),
        epaGasCode: new FormControl(epaGasCode,
          Validators.required,
        ),
        gasConcentration: new FormControl(gasConc,
          Validators.required,
        ),
        uom: new FormControl(uom,
          Validators.required,
        )
      }))
    }
  }

  removeComponentGases(gasCodes: string[]) {
    const matchedFormGroups = this.componentGases.controls.filter(gas => gasCodes.includes(gas.value.qaGasDefCode));
    matchedFormGroups.forEach(g => {
      const index = this.componentGases.controls.indexOf(g);
      this.componentGases.removeAt(index);
    });
  }

  gasCodeChange(componentGas: HTMLInputElement) {
    switch (componentGas.name) {
      case 'gasCode':
        if (componentGas.checked) {
          this.addComponentGas(componentGas.value);
          this.addEPAGasTypeCode(componentGas.value);
          this.clearOtherCodes();
          
          // BALA and O2 are mutually exclusive
          if (componentGas.value === 'O2') {
            this.removeEPAGasTypeCodes(['BALA']);
          }
        }
        else {
          this.removeComponentGases([componentGas.value]);
          this.removeEPAGasTypeCodes([componentGas.value]);
        }
        break;

      case 'balCode':
        if (componentGas.checked) {
          this.clearBalCodesExceptSelf(componentGas.value);
          this.clearOtherCodes();

          this.addComponentGas(componentGas.value);
          this.addEPAGasTypeCode(componentGas.value);

          // BALA and O2 are mutually exclusive
          if (componentGas.value === 'BALA') {
            this.removeEPAGasTypeCodes(['O2']);
            this.removeComponentGases(['O2']);
          }
          
        }
        else {
          this.removeComponentGases([componentGas.value]);
          this.removeEPAGasTypeCodes([componentGas.value]);
        }
        break;
      
      case 'otherCode':
        if (componentGas.checked) {
          this.clearOtherCodesExceptSelf(componentGas.value);
          this.clearBalCodes();
          this.clearCommonCodes();

          if (componentGas.value === 'AIR') {
            this.addComponentGas('O2', 'O2', 20.9, '%O2');
            this.addEPAGasTypeCode('O2');
            this.addEPAGasTypeCode('AIR');
            this.cylinderID.setValue('Inst Air');

            // Update to create real date time / fix to auto select from date picker
            this.expirationDate.setValue('1/1/2200');
          }
          else {
            this.addComponentGas(componentGas.value);
            this.addEPAGasTypeCode(componentGas.value);

            // This is required since AIR has different value "O2"
            this.removeEPAGasTypeCodes(['AIR']);
          }
        }
        else {
          if (componentGas.value === 'AIR') {
            this.removeComponentGases(['O2']);
            this.removeEPAGasTypeCodes(['O2']);
            this.cylinderID.setValue(this.origionalTitle);

            // Needs to deselect from date picker
            this.expirationDate.setValue('');
          }
          else {
            this.removeComponentGases([componentGas.value]);
            this.removeEPAGasTypeCodes([componentGas.value]);
          }
        }
        break;

      case 'gasCodeString':
        console.log(componentGas.value)
        break;

      default:
        break;
    }
    this.isBalCodeSelected();
  }

  clearOtherCodes() {
    this.removeComponentGases(this.otherCodes);
    this.removeEPAGasTypeCodes(this.otherCodes);
  }

  clearOtherCodesExceptSelf(code) {
    const filteredOtherCodes = this.otherCodes.filter(c => c !== code);
    this.removeComponentGases(filteredOtherCodes);
    this.removeEPAGasTypeCodes(filteredOtherCodes);
  }

  clearBalCodes() {
    this.removeComponentGases(this.balCodes);
    this.removeEPAGasTypeCodes(this.balCodes);
  }

  clearBalCodesExceptSelf(code) {
   const filteredBalCodes = this.balCodes.filter(c => c !== code);
   this.removeComponentGases(filteredBalCodes);
   this.removeEPAGasTypeCodes(filteredBalCodes);
  }

  clearCommonCodes() {
    this.removeComponentGases(this.commonGasCodes);
    this.removeComponentGases(this.uncommonGasCodes);
    this.removeEPAGasTypeCodes(this.commonGasCodes);
    this.removeEPAGasTypeCodes(this.uncommonGasCodes);
  }

  clearCylinderInputs() {
    this.cylinderID.setValue('');
    this.vendorID.setValue('');
    this.expirationDate.setValue('');
    this.certificationImage.setValue('');
  }

  isGasChecked(code) {
    return (this.epaGasTypeCodes.controls.filter(c => c.value === code).length > 0);
  }

  getGasCodeString() {
    let gasCodeString = '';
    this.epaGasTypeCodes.controls.forEach(c => {
      if (this.epaGasTypeCodes.controls.indexOf(c) === (this.epaGasTypeCodes.controls.length - 1)) {
        gasCodeString = gasCodeString.concat(c.value);
      }
      else {
        gasCodeString = gasCodeString.concat(c.value + ', ');
      }
    })
    return gasCodeString;
  }

  isBalCodeSelected() {
    let commonOrUncommonGasSelected = false;
    this.balCodeSelected = true;

    // BALN or BALA is required only if a common / uncommon gas is selected
    this.epaGasTypeCodes.value.forEach(code => {
      if (this.commonGasCodes.includes(code) || this.uncommonGasCodes.includes(code)) {
        commonOrUncommonGasSelected = true;
      }
    })

    // Override if 'AIR' exists
    if (this.epaGasTypeCodes.value.includes('AIR')) {
      commonOrUncommonGasSelected = false;
    }

    if (commonOrUncommonGasSelected) {
      this.balCodeSelected = false;
      this.epaGasTypeCodes.value.forEach(code => {
        if (this.balCodes.includes(code)) {
          this.balCodeSelected = true;
        }
      });
    }
  }

  onClearCylinder() {
    this.clearBalCodes();
    this.clearCommonCodes();
    this.clearOtherCodes();
    this.clearCylinderInputs();
  }

  onCancel() {
    this.dialogRef.close();    
  }
}

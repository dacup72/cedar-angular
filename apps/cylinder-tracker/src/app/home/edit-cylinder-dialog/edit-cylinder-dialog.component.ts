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
  // commonGasCodesOBJ = { 
  //   NO: false,
  //   NO2: false,
  //   NOX: false,
  //   CO: false,
  //   O2: false,
  //   SO2: false,
  //   CO2: false
  // };
  uncommonGasCodes = ['N2O', 'PPN', 'CH4', 'HE', 'H2S']
  // uncommonGasCodesOBJ = {
  //   N2O: false,
  //   PPN: false,
  //   CH4: false,
  //   HE: false,
  //   H2S: false
  // };
  balCodes = ['BALN', 'BALA'];
  // balCodesOBJ = {
  //   BALN: false, 
  //   BALA: false
  // };
  otherCodes = ['APPVD', 'AIR', 'SRM', 'NTRM', 'GMIS', 'RGM', 'PRM', 'ZERO'];
  // otherCodesOBJ = {
  //   APPVD: false, 
  //   AIR: false, 
  //   SRM: false, 
  //   NTRM: false, 
  //   GMIS: false, 
  //   RGM: false, 
  //   PRM: false, 
  //   ZERO: false
  // };
  measurementTypes = ['ppm', '%CO2', '%O2', 'ppb'];
  // selectedGasCode = '';
  showMoreGases = false;
  //stringOfGasCodes = '';

  // gasColors = {
  //   $cylindertrackerso2: '#9DCC5F',
  //   $cylindertrackerso2text: 'black',
  //   $cylindertrackerso2secondary: '#8E5FCC',
  //   $cylindertrackerso2secondarytext: 'white',
  //   $cylindertrackerno: '#36D6E7',
  //   $cylindertrackernotext: 'black',
  //   $cylindertrackernosecondary: '#E74736',
  //   $cylindertrackernosecondarytext: 'black',
  //   $cylindertrackerno2: '#9BCCFD',
  //   $cylindertrackerno2text: 'black',
  //   $cylindertrackerno2secondary: '#FDCC9B',
  //   $cylindertrackerno2secondarytext: 'black',
  //   $cylindertrackernox: '#0074DD',
  //   $cylindertrackernoxtext: 'white',
  //   $cylindertrackernoxsecondary: '#DD6900',
  //   $cylindertrackernoxsecondarytext: 'black',
  //   $cylindertrackern2o: '#81599F',
  //   $cylindertrackern2otext: 'white',
  //   $cylindertrackern2osecondary: '#779F59',
  //   $cylindertrackern2osecondarytext: 'black',
  //   $cylindertrackerco2: '#FD7F20',
  //   $cylindertrackerco2text: 'black',
  //   $cylindertrackerco2secondary: '#209EFD',
  //   $cylindertrackerco2secondarytext: 'black',
  //   $cylindertrackerco: '#FDB750',
  //   $cylindertrackercotext: 'black',
  //   $cylindertrackercosecondary: '#5096FD',
  //   $cylindertrackercosecondarytext: 'black',
  //   $cylindertrackero2: '#335120',
  //   $cylindertrackero2text: 'white',
  //   $cylindertrackero2secondary: '#3E2051',
  //   $cylindertrackero2secondarytext: 'white',
  //   $cylindertrackerppn: '#660A60',
  //   $cylindertrackerppntext: 'white',
  //   $cylindertrackerppnsecondary: '#0A6610',
  //   $cylindertrackerppnsecondarytext: 'white',
  //   $cylindertrackerch4: '#FF5C4D',
  //   $cylindertrackerch4text: 'black',
  //   $cylindertrackerch4secondary: '#4DF0FF',
  //   $cylindertrackerch4secondarytext: 'black',
  //   $cylindertrackerhe: '#FFCD58',
  //   $cylindertrackerhetext: 'black',
  //   $cylindertrackerhesecondary: '#588AFF',
  //   $cylindertrackerhesecondarytext: 'black',
  //   $cylindertrackerh2s: '#FF5C4D',
  //   $cylindertrackerh2stext: 'black',
  //   $cylindertrackerh2ssecondary: '#4DF0FF',
  //   $cylindertrackerh2ssecondarytext: 'black',
  // }
    // TODO find better way to make dynamic colors for gases

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<EditCylinderDialogComponent>, fb: FormBuilder) {
    this.currentCylinder = !data.cylinder ? cloneDeep(emptyCylinder) : cloneDeep(data.cylinder);
    this.origionalTitle = !data.cylinder ? '' : data.cylinder.cylinderID;
    
    // Build new form control for cylinder
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

  removeComponentGases(gasCodes: string[]) {
    const matchedFormGroups = this.componentGases.controls.filter(gas => gasCodes.includes(gas.value.qaGasDefCode));
    matchedFormGroups.forEach(g => {
      const index = this.componentGases.controls.indexOf(g);
      this.componentGases.removeAt(index);
    });
  }

  newGasCodeChange(componentGas: HTMLInputElement) {
    switch (componentGas.name) {
      case 'gasCode':
        if (componentGas.checked) {
          this.addComponentGas(componentGas.value);
          this.addEPAGasTypeCode(componentGas.value);
        }
        else {
          this.removeComponentGases([componentGas.value]);
          this.removeEPAGasTypeCodes([componentGas.value]);
        }
        break;

      case 'balCode':
        if (componentGas.checked) {
          this.newClearBalCodesExceptSelf(componentGas.value);
          this.newClearOtherCodes();

          this.addComponentGas(componentGas.value);
          this.addEPAGasTypeCode(componentGas.value);
          
        }
        else {
          this.removeComponentGases([componentGas.value]);
          this.removeEPAGasTypeCodes([componentGas.value]);
        }
        break;
      
      case 'otherCode':
        if (componentGas.checked) {
          this.newClearOtherCodesButSelf(componentGas.value);
          this.newClearBalCodes();
          this.newClearCommonCodes();

          if (componentGas.value === 'AIR') {
            this.addComponentGas('O2', 'O2', 20.9, '%O2');
            this.addEPAGasTypeCode('O2');
            this.cylinderID.setValue('Inst Air');
          }
          else {
            this.addComponentGas(componentGas.value);
            this.addEPAGasTypeCode(componentGas.value);
          }
        }
        else {
          if (componentGas.value === 'AIR') {
            this.removeComponentGases(['O2']);
            this.removeEPAGasTypeCodes(['O2']);
            this.cylinderID.setValue(this.origionalTitle);
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
  }

  newClearOtherCodes() {
    this.removeComponentGases(this.otherCodes);
    this.removeEPAGasTypeCodes(this.otherCodes);
  }

  newClearOtherCodesButSelf(code) {
    const filteredOtherCodes = this.otherCodes.filter(c => c !== code);
    this.removeComponentGases(filteredOtherCodes);
    this.removeEPAGasTypeCodes(filteredOtherCodes);
  }

  newClearBalCodes() {
    this.removeComponentGases(this.balCodes);
    this.removeEPAGasTypeCodes(this.balCodes);
  }

  newClearBalCodesExceptSelf(code) {
   const filteredBalCodes = this.balCodes.filter(c => c !== code);
   this.removeComponentGases(filteredBalCodes);
   this.removeEPAGasTypeCodes(filteredBalCodes);
  }

  newClearCommonCodes() {
    this.removeComponentGases(this.commonGasCodes);
    this.removeComponentGases(this.uncommonGasCodes);
    this.removeEPAGasTypeCodes(this.commonGasCodes);
    this.removeEPAGasTypeCodes(this.uncommonGasCodes);
  }

  newClearCylinderInputs() {
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

  newOnClearCylinder() {
    this.newClearBalCodes();
    this.newClearCommonCodes();
    this.newClearOtherCodes();
    this.newClearCylinderInputs();
  }

  onCancel() {
    this.dialogRef.close();    
  }

















  // ngAfterViewInit(): void {
  //   // TODO: this produces a console error message, fix it
  //   this.currentCylinder.epaGasTypeCodes.forEach(c => {
  //     this.commonGasCodesOBJ[c] = true;
  //     this.balCodesOBJ[c] = true;

  //     if(!this.stringOfGasCodes.length) {
  //       this.stringOfGasCodes = c.toUpperCase();
  //     }
  //     else if(!this.stringOfGasCodes.split(', ').includes(c.toUpperCase())) {
  //       let newArr = this.stringOfGasCodes.split(', ');
  //       newArr.push(c.toUpperCase());
  //       this.stringOfGasCodes = newArr.join(', ');
  //     }
  //   })
  // }

  // cylIDFormControl = new FormControl('', [
  //   Validators.required
  // ]);

  // expDateFormControl = new FormControl('', [
  //   Validators.required
  // ]);

  // vendorIDFormControl = new FormControl('', [
  //   Validators.required
  // ]);

  // gasCodeStringFormControl = new FormControl('', [
  //   Validators.required
  // ]);

  // gasCodeChange(event, gasCode) {
  //   // update current cylinder
  //   if(event.checked) {
  //     this.clearOtherCodes();
  //     this.currentCylinder.epaGasTypeCodes = this.currentCylinder.epaGasTypeCodes.concat([gasCode]);
  //     const emptyComponentGas: ComponentGas = {
  //       qaGasDefCode: gasCode,
  //       epaGasCode: gasCode,
  //       gasConcentration: null,
  //       uom: null
  //     }
  //     this.currentCylinder.componentGases = this.currentCylinder.componentGases.concat([emptyComponentGas]);
  //   }
  //   else {
  //     this.currentCylinder.epaGasTypeCodes = this.currentCylinder.epaGasTypeCodes.filter(code => code !== gasCode);
  //     this.currentCylinder.componentGases = this.currentCylinder.componentGases.filter(gas => gas.epaGasCode !== gasCode);
  //   }

  //   // Update gas code string
  //   if(!event.checked && this.stringOfGasCodes.split(', ').includes(gasCode.toUpperCase())) {
  //     let newArr = this.stringOfGasCodes.split(', ');
  //     newArr.splice(newArr.indexOf(gasCode.toUpperCase()), 1);
  //     this.stringOfGasCodes = newArr.join(', ');
  //   }
  //   else if(!this.stringOfGasCodes.length) {
  //     this.stringOfGasCodes = gasCode.toUpperCase();
  //   }
  //   else if(!this.stringOfGasCodes.split(', ').includes(gasCode.toUpperCase())) {
  //     let newArr = this.stringOfGasCodes.split(', ');
  //     newArr.push(gasCode.toUpperCase());
  //     this.stringOfGasCodes = newArr.join(', ');
  //   }
  //   //console.log(this.commonGasCodesCodesOBJ)
    
  // }

  // gasTypeSelected(event) {
  //   //console.log(event)
  // }

  // getMeasurementValue(componentGas) {
  //   const selectedGas = this.currentCylinder.componentGases.filter(gas => gas.epaGasCode === componentGas);
  //   return selectedGas.length > 0  ? selectedGas[0].gasConcentration : '';
  // }

  // getMeasurementType(componentGas) {
  //   const selectedGas = this.currentCylinder.componentGases.filter(gas => gas.epaGasCode === componentGas);
  //   return selectedGas.length > 0 ? selectedGas[0].uom : '';
  // }

  // measurementValueChange(event, componentGas) {
  //   this.currentCylinder.componentGases.filter(gas => gas.epaGasCode === componentGas)[0].gasConcentration = event.target.value;
  // }

  // measurementTypeChange(event, componentGas) {
  //   this.currentCylinder.componentGases.filter(gas => gas.epaGasCode === componentGas)[0].uom = event.value;
  // }

  // resetCurrentCylinder() {
    
  //   this.currentCylinder = cloneDeep(emptyCylinder);
    
  // }

  // onClearCylinder() {
  //   this.resetCurrentCylinder();
  //   this.clearCommonCodes();
  //   this.clearBalCodes();
  //   this.clearOtherCodes();
  //   this.stringOfGasCodes = '';
  // }

  // gasCodeStringChange(event) {
  //   console.log(event.target.value)
  // }

  // balCodeChange(event, code) {
  //   if(event.checked) {
  //     this.clearBalCodesExceptSelf(code);
  //     this.clearOtherCodes();
  //   }
  // }

  // otherCodeChanged(event, code) {
  //   if(event.checked) {
  //     this.clearOtherCodesButSelf(code);
  //     this.clearBalCodes();
  //     this.clearCommonCodes();
  //     this.currentCylinder.epaGasTypeCodes = [];
  //     this.currentCylinder.componentGases = [];
  //     this.stringOfGasCodes = '';

  //     if(code === 'AIR') {
  //       this.currentCylinder.componentGases = [
  //         {
  //           qaGasDefCode: 'O2',
  //           epaGasCode: 'O2',
  //           gasConcentration: 20.9,
  //           uom: '%O2'
  //         }
  //       ];
  //       this.currentCylinder.epaGasTypeCodes = ['O2'];
  //       this.currentCylinder.cylinderID = 'Inst Air';
  //       this.stringOfGasCodes = 'O2';
  //       this.commonGasCodesOBJ['O2'] = true;
  //     }
  //   }
  // }

  // clearCommonCodes() {
  //   this.commonGasCodes.forEach(gas => {
  //     this.commonGasCodesOBJ[gas] = false;
  //   })
  // }

  // clearBalCodesExceptSelf(balCode) {
  //   this.balCodes.forEach(code => {
  //     if(code !== balCode) {
  //       this.balCodesOBJ[code] = false;
  //     }
  //   })
  // }

  // clearBalCodes() {
  //   this.balCodes.forEach(code => {
  //     this.balCodesOBJ[code] = false;
  //   })
  // }

  // clearOtherCodesButSelf(otherCode) {
  //   this.otherCodes.forEach(code => {
  //     if(code !== otherCode) {
  //       this.otherCodesOBJ[code] = false;
  //     }
  //   })
  // }

  // clearOtherCodes() {
  //   this.otherCodes.forEach(code => {
  //     this.otherCodesOBJ[code] = false;
  //   })
  // }

}

import { Component, OnInit } from '@angular/core';
import {
  CylindersFacade,
  Cylinder,
  GasProfilesFacade,
  QAGasProfile,
  UnitDefsFacade,
  UnitDef,
  CrossCardFilters,
  emptyCrossCardFilters
} from '@cedar-all/core-data';
import { Observable } from 'rxjs';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { User, ErrorInfo } from '@cedar-angular/api-interfaces';
import { UserService } from '@cedar-all/core-data';
import { first } from 'rxjs/operators';
import { CylinderDropDialogComponent } from './cylinder-drop-dialog/cylinder-drop-dialog.component';
import { EditCylinderDialogComponent } from './edit-cylinder-dialog/edit-cylinder-dialog.component'; 
import { GasProfileUnassignDialogComponent } from './gas-profile-unassign-dialog/gas-profile-unassign-dialog.component';
//import { CylinderUnassignDialogComponent } from './cylinder-unassign-dialog/cylinder-unassign-dialog.component';
import { CylinderRetireDialogComponent } from './cylinder-retire-dialog/cylinder-retire-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';


@Component({
  selector: 'cylinder-tracker-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  //selectedCylinder$: Observable<Cylinder> = this.cylindersFacade.selectedCylinder$;
  cylinders$: Observable<Cylinder[]> = this.cylindersFacade.allCylinders$;
  gasProfiles$: Observable<QAGasProfile[]> = this.gasProfilesFacade.allGasProfiles$;
  users: User[];
  unitDefs$: Observable<UnitDef[]> = this.unitDefsFacade.allUnitDefs$;

  loading = false;
  reverseCards = false;

  availableCardFiltes: CrossCardFilters = cloneDeep(emptyCrossCardFilters);
  assignCardFilters: CrossCardFilters = cloneDeep(emptyCrossCardFilters);

  constructor(
    private cylindersFacade: CylindersFacade,
    private userService: UserService,
    private gasProfilesFacade: GasProfilesFacade,
    private unitDefsFacade: UnitDefsFacade,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // INIT CYLINDERS
    this.cylindersFacade.loadCylinders();
    this.cylindersFacade.mutations$.subscribe(_ =>
      this.resetSelectedCylinder()
    );
    this.resetSelectedCylinder();

    // INIT GAS PROFILES
    this.gasProfilesFacade.loadGasProfiles();
    this.gasProfilesFacade.mutations$.subscribe(_ =>
      this.resetSelectedGasProfile()
    );
    this.resetSelectedGasProfile();

    // INIT UNIT DEFS
    this.unitDefsFacade.loadUnitDefs();

    // INIT USERS
    this.loading = true;
    this.userService
      .getAll()
      .pipe(first())
      .subscribe(users => {
        this.loading = false;
        this.users = users;
      });
  }
  
  getCylindersList() {
    const cylindersOutput: Cylinder[] = [];
    const cylindersObs = this.cylinders$.subscribe(cylinders => {
      cylinders.forEach(cylinder => cylindersOutput.push(cloneDeep(cylinder)));
    });
    cylindersObs.unsubscribe();
    return cylindersOutput;
  }

  getGasProfilesList() {
    const gasProfilesOutput: QAGasProfile[] = [];
    const gasProfilesObs = this.gasProfiles$.subscribe(gasProfiles => {
      gasProfiles.forEach(gasProfile => gasProfilesOutput.push(cloneDeep(gasProfile)));
    });
    gasProfilesObs.unsubscribe();
    return gasProfilesOutput;
  }

  getUnitDefsList() {
    const unitDefsOutput: UnitDef[] = [];
    const unitDefsObs = this.unitDefs$.subscribe(unitDefs => {
      unitDefs.forEach(unitDef => unitDefsOutput.push(cloneDeep(unitDef)));
    });
    unitDefsObs.unsubscribe();
    return unitDefsOutput;
  }

  // CYLINDERS ACTIONS
  resetSelectedCylinder() {
    this.selectCylinder({ id: null });
  }

  selectCylinder(cylinder) {
    this.cylindersFacade.selectCylinder(cylinder.id);
  }

  saveCylinder(cylinder) {
    if (cylinder.id) {
      this.cylindersFacade.updateCylinder(cylinder);
    } else {
      this.cylindersFacade.createCylinder(cylinder);
    }
  }

  deleteCylinder(cylinder) {
    this.cylindersFacade.deleteCylinder(cylinder);
  }

  // GAS PROFILES ACTIONS
  resetSelectedGasProfile() {
    this.selectGasProfle({ id: null });
  }

  selectGasProfle(gasProfile) {
    this.gasProfilesFacade.selectGasProfile(gasProfile.id);
  }

  updateGasProfile(gasProfile) {
    this.gasProfilesFacade.updateGasProfile(gasProfile);
  }

  swapCards() {
    this.reverseCards = !this.reverseCards;
  }

  // CYLINDER DRAG AND DROP EVENT
  cylinderDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) return;

    const dropContainerID = event.container.id;
    const draggedCylinder: Cylinder = cloneDeep(event.item.data);
    const dropContainerItem = cloneDeep(event.container.data[0]);

    if(draggedCylinder.cylinderID === dropContainerItem['cylinderID'] || draggedCylinder.cylinderID === dropContainerItem['cylID'])  return;

    // Cylinder dropped on Gas Profile
    if (dropContainerID.includes('gasProfileDropList')) {

      // If gas profile has no assigned cylinder
      if(!dropContainerItem['cylID']) this.validateCylinders(event, 'gasProfileDropList', draggedCylinder, dropContainerItem);
      else this.openCylinderDroppedDialog(event, 'gasProfileDropList', draggedCylinder, dropContainerItem);
    }
    // Cylinder dropped on in-use cylinder
    else if(dropContainerID.includes('inUseDropList')) {
      this.openCylinderDroppedDialog(event, 'inUseDropList', draggedCylinder, dropContainerItem);
    }
  }

  openCylinderDroppedDialog(event: CdkDragDrop<string[]>, dropList: string, draggedCylinder: Cylinder, dropContainerItem) {
    const dialogData = {
      cylinder1: draggedCylinder,
      cylinder2: null,
      gasProfiles: [],
      gasProfiles2: [],
      unitDefs: this.getUnitDefsList(),
      dropType: `${draggedCylinder.state} to ${dropList}`,
      isLastAssignedGasProfile: false
    }

    // Set dialog data cylinders and gas profiles
    if (dropList === 'gasProfileDropList') {
      dialogData.cylinder2 = this.getCylindersList().filter(cylinder => cylinder.cylinderID === dropContainerItem['cylID'])[0];
      dialogData.gasProfiles = [dropContainerItem];
      dialogData.isLastAssignedGasProfile = this.getGasProfilesList().filter(gasProfile => gasProfile.cylID === dialogData.cylinder2['cylinderID']).length === 1;
    }
    else if(dropList === 'inUseDropList') {
      dialogData.cylinder2 = dropContainerItem;
      dialogData.gasProfiles = this.getGasProfilesList().filter(gasProfile => gasProfile.cylID === dropContainerItem['cylinderID']);
      if(dialogData.dropType === 'inUse to inUseDropList') {
        dialogData.gasProfiles2 = this.getGasProfilesList().filter(gasProfile => gasProfile.cylID === draggedCylinder.cylinderID);
      }
    }
    
    const dialogRef = this.dialog.open(CylinderDropDialogComponent, { data: dialogData });
    
    dialogRef.afterClosed().subscribe(options => {
      if(!options) return;
      if(options.gasProfilesBeingChanged.length) this.validateCylinders(event, dropList, draggedCylinder, dropContainerItem, options);
    });
  }

  //TODO: Fix the multiple component updates happening due to multiple state changing method calls
  validateCylinders(event: CdkDragDrop<string[]>, dropList: string, draggedCylinder: Cylinder, dropContainerItem, dialogOptions?) {

    // Transfer dropped cylinder to recieving array for smooth UI transition
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // Cylinder Dropped On Gas Profile
    if (dropList === 'gasProfileDropList') {

      // If replaceing already assigned cylinder then find and update that cylinder
      if(dropContainerItem['cylID']) {
        const previousAssignedCylinder = this.getCylindersList().filter(cylinder => cylinder.cylinderID === dropContainerItem['cylID'])[0];
        previousAssignedCylinder.state = dialogOptions.selectedState;
        this.saveCylinder(previousAssignedCylinder);
      }

      // Update the newely assigned cylinder and gas profile
      dropContainerItem['cylID'] = draggedCylinder.cylinderID;
      draggedCylinder.state = 'inUse';
      this.updateGasProfile(dropContainerItem);
      this.saveCylinder(draggedCylinder);
    }

    // TODO: Dropping inUse cylinder onto another inUse cylinder needs to have options to swap or replace
    if(dropList === 'inUseDropList') {
     
      // inUse to inUse
      if(draggedCylinder.state === 'inUse') {
        this.getGasProfilesList().forEach(gasProfile => {
          if(gasProfile.cylID === dropContainerItem.cylinderID) {
            gasProfile.cylID = draggedCylinder.cylinderID;
            this.updateGasProfile(gasProfile);
          }
          else if(gasProfile.cylID === draggedCylinder.cylinderID) {
            gasProfile.cylID = dropContainerItem.cylinderID;
            this.updateGasProfile(gasProfile);
          }
        });
      }
      // Spare to inUse
      else {
        dropContainerItem['state'] = dialogOptions.selectedState;
        
        // Update the selected gas profiles
        this.getGasProfilesList().forEach(gasProfile => {
          if(dialogOptions.gasProfilesBeingChanged.includes(gasProfile.tagID)) {
            gasProfile.cylID = draggedCylinder.cylinderID;
            console.log(gasProfile)
            this.updateGasProfile(gasProfile);
          }
        });
  
        draggedCylinder.state = 'inUse';
        draggedCylinder.errorList = this.checkForCylErrors(
          draggedCylinder, 
          this.getGasProfilesList().filter(gasProfile => dialogOptions.gasProfilesBeingChanged.includes(gasProfile.tagID))
        )
        dropContainerItem.errorList = this.checkForCylErrors(dropContainerItem, []);
      }
     
      draggedCylinder.errorList = this.checkForCylExpired(draggedCylinder);
      //console.log('dragged: ', draggedCylinder)
      //console.log('drop container: ', dropContainerItem)
      this.saveCylinder(dropContainerItem);
      this.saveCylinder(draggedCylinder);
    }
  }

  checkForCylExpired(cylinder: Cylinder) {
    const errors = [...cylinder.errorList];
    const currentDate = new Date();

    if(Date.parse(cylinder.expirationDate) < Date.parse(currentDate.toString())) {
      const errorItem = {
        severity: '4',
        errorMsg: 'Cylinder is expired'
      };

      let errorExists = false;

      errors.forEach(err => {
        if(err.errorMsg === errorItem.errorMsg) {
          errorExists = true;
        }
      })

      if(!errorExists) {
        errors.push(errorItem);
      }
    }
    
    return errors;
  }

  checkForCylErrors(cylinder: Cylinder, gasProfiles: QAGasProfile[]) {
    let cylErrors = cylinder.errorList.filter(error => !error.errorMsg.includes('Missing required gas'));
    cylErrors = cylErrors.filter(error => !error.errorMsg.includes('Gas concentration'));

    gasProfiles.forEach(gasProfile => {
      // Check for correct gases
      if(!cylinder.epaGasTypeCodes.includes(gasProfile.cedarGasCode)) {
        const errorItem = {
          severity: '3',
          errorMsg: 'Missing required gas: ' + gasProfile.cedarGasCode
        }
        let errorExists = false;

        cylErrors.forEach(err => {
          if(err.errorMsg === errorItem.errorMsg) {
            errorExists = true;
          }
        })

        if(!errorExists) {
          cylErrors.push(errorItem);
        }
      }
      // Check for correct gas concentrations
      else {
        cylinder.componentGases.forEach(cylGas => {
          if(cylGas.epaGasCode === gasProfile.cedarGasCode) {
            const outOfRange1 = (cylGas.gasConcentration > parseInt(gasProfile.allowableGasValueMax) || cylGas.gasConcentration < parseInt(gasProfile.allowableGasValueMin));
            let outOfRange2 = null;
            let range1Msg = '';
            let range2Msg = '';
            let errorExists = false;
            
            if(gasProfile.allowableGasValueMin2) {
              outOfRange2 = (cylGas.gasConcentration > parseInt(gasProfile.allowableGasValueMax2) || cylGas.gasConcentration < parseInt(gasProfile.allowableGasValueMin2));
            }
            if(outOfRange1) {
              range1Msg = `(${gasProfile.allowableGasValueMin} - ${gasProfile.allowableGasValueMax} ${gasProfile.uom}${range2Msg})`;
            }
            if(outOfRange2) {
              range2Msg = `(${gasProfile.allowableGasValueMin2} - ${gasProfile.allowableGasValueMax2} ${gasProfile.uom})`;
            }

            if(outOfRange1 || outOfRange2) {
              const errorItem = {
                severity: '3',
                errorMsg:  `Gas concentration (${cylGas.gasConcentration} ${cylGas.uom} ${cylGas.epaGasCode}) is outside allowable ranges ${range1Msg} ${range2Msg}`
              };

              cylErrors.forEach(err => {
                if(err.errorMsg === errorItem.errorMsg) {
                  errorExists = true;
                }
              })

              if(!errorExists) {
                cylErrors.push(errorItem);
              }
            }
          }
        });
      }
    })

    return cylErrors;    
  }

  checkForGasErrors(cylinder: Cylinder, gasProfile: QAGasProfile) {
    const gasErrors = [...gasProfile.errorInfo];
    
  }

  editCylinder(cylinder: Cylinder, editSimilar = false) {
    const dialogData = {
      cylinder: cloneDeep(cylinder)
    }

    if(editSimilar) {
      dialogData.cylinder.cylinderID = '';
      dialogData.cylinder.id = null;
    }

    const dialogRef = this.dialog.open(EditCylinderDialogComponent, { data: dialogData });
    
    dialogRef.afterClosed().subscribe(cylinder => {
      if(!cylinder) return;
      // TODO: Fix the form to no add additional component gas which requires this shift method
      //if(!cylinder.id) cylinder.componentGases.shift();
      this.saveCylinder(cylinder);
    });
  }

  retireCylinder(cylinder: Cylinder) {
    const dialogRef = this.dialog.open(CylinderRetireDialogComponent, {
      data: {
        cylinder: cylinder
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {

        // Remove assigned gas profiles
        this.getGasProfilesList().forEach(gasProfile => {
          if(gasProfile.cylID === cylinder.cylinderID) {
            gasProfile.cylID = '';
            this.updateGasProfile(gasProfile);
          }
        })

        const changedCylinder = cloneDeep(cylinder);
        changedCylinder.state = 'retired';
        this.saveCylinder(changedCylinder);
      }
    });    
  }

  openGasProfileUnassignDialog(assignedCylinder: Cylinder, gasProfile: QAGasProfile) {
    const dialogRef = this.dialog.open(GasProfileUnassignDialogComponent, {
      data: {
        cylinder: assignedCylinder
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'retire') this.finishUassignCylinder(assignedCylinder, gasProfile, 'retired');
      else if(result === 'spare') this.finishUassignCylinder(assignedCylinder, gasProfile, 'spare');
    });
  }

  finishUassignCylinder(assignedCylinder: Cylinder, gasProfile: QAGasProfile, action: string) {
    assignedCylinder.state = action;

    const gasProfileChange = cloneDeep(gasProfile);
    gasProfileChange.cylID = '';

    this.updateGasProfile(gasProfileChange);
    this.saveCylinder(assignedCylinder);
  }

  availableFilteringAssign(item) {
    const gases = item.epaGasTypeCodes ? item.epaGasTypeCodes : item.cedarGasTypeCodes;
    const filterItem = item.epaGasTypeCodes ? item.cylinderID : item.desc;
    this.assignCardFilters.gasCodes = ['_ACC_', ...gases];
    this.assignCardFilters.concentration = item.componentGases;
    this.assignCardFilters.filterItem = filterItem;
    this.assignCardFilters = cloneDeep(this.assignCardFilters);
  }

  assignFilteringAvailable(item) {
    const gases = item.epaGasTypeCodes ? item.epaGasTypeCodes : [item.cedarGasCode];
    const filterItem = item.epaGasTypeCodes ? item.cylinderID : item.desc;
    this.availableCardFiltes.gasCodes = ['_ACC_', ...gases];
    if(item.componentGases) {
      this.availableCardFiltes.concentration = item.componentGases;
    }
    else {
      this.availableCardFiltes.concentration = [{
        cedarGasCode: item.cedarGasCode,
        allowableGasValueMin: item.allowableGasValueMin,
        allowableGasValueMax: item.allowableGasValueMax,
        allowableGasValueMin2: item.allowableGasValueMin2,
        allowableGasValueMax2: item.allowableGasValueMax2,
      }]
    }
    this.availableCardFiltes.filterItem = filterItem;
    this.availableCardFiltes = cloneDeep(this.availableCardFiltes);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}



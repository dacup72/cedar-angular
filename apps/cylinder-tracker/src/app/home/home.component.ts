import { Component, OnInit, Input } from '@angular/core';
import {
  CylindersFacade,
  Cylinder,
  GasProfilesFacade,
  QAGasProfile,
  UnitDefsFacade,
  UnitDef,
  CylinderFilters,
  emptyCylinderFilters,
  GasProfileFilters,
  emptyGasProfileFilters,
  CylinderTrackerAppState,
  CylinderTrackerFacade
} from '@cedar-all/core-data';
import { Observable } from 'rxjs';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { User, ErrorInfo } from '@cedar-angular/api-interfaces';
import { UserService } from '@cedar-all/core-data';
import { first } from 'rxjs/operators';
import { CylinderDropDialogComponent } from './cylinder-drop-dialog/cylinder-drop-dialog.component';
import { EditCylinderDialogComponent } from './edit-cylinder-dialog/edit-cylinder-dialog.component'; 
import { GasProfileUnassignDialogComponent } from './gas-profile-unassign-dialog/gas-profile-unassign-dialog.component';
import { CylinderRetireDialogComponent } from './cylinder-retire-dialog/cylinder-retire-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { 
  cloneDeep as _cloneDeep,
  uniqWith as _uniqWith,
  isEqual as _isEqual 
} from 'lodash';


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
  cylinderTrackerState$: Observable<CylinderTrackerAppState[]> = this.cylinderTrackerFacade.cylinderTrackerAppState$;

  loading = false;
  availableCardFiltes: {cylinderFilters: CylinderFilters};
  assignCardFilters: {cylinderFilters: CylinderFilters, gasProfileFilters: GasProfileFilters};
  panelsReversed = false;

  constructor(
    private cylindersFacade: CylindersFacade,
    private userService: UserService,
    private gasProfilesFacade: GasProfilesFacade,
    private unitDefsFacade: UnitDefsFacade,
    private cylinderTrackerFacade: CylinderTrackerFacade,
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

    //TODO: Possible memory leak as this observable is never unsubscribed from, look into it
    this.cylinderTrackerState$.subscribe(state => {
      this.panelsReversed = state[0].panelsReversed;
    });
  }
  
  getCylindersList() {
    const cylindersOutput: Cylinder[] = [];
    const cylindersObs = this.cylinders$.subscribe(cylinders => {
      cylinders.forEach(cylinder => cylindersOutput.push(_cloneDeep(cylinder)));
    });
    cylindersObs.unsubscribe();
    return cylindersOutput;
  }

  getGasProfilesList() {
    const gasProfilesOutput: QAGasProfile[] = [];
    const gasProfilesObs = this.gasProfiles$.subscribe(gasProfiles => {
      gasProfiles.forEach(gasProfile => gasProfilesOutput.push(_cloneDeep(gasProfile)));
    });
    gasProfilesObs.unsubscribe();
    return gasProfilesOutput;
  }

  getUnitDefsList() {
    const unitDefsOutput: UnitDef[] = [];
    const unitDefsObs = this.unitDefs$.subscribe(unitDefs => {
      unitDefs.forEach(unitDef => unitDefsOutput.push(_cloneDeep(unitDef)));
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

  // CYLINDER DRAG AND DROP EVENT
  cylinderDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) return;

    const dropContainerID = event.container.id;
    const draggedCylinder: Cylinder = _cloneDeep(event.item.data);
    const dropContainerItem = _cloneDeep(event.container.data[0]);

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

    // Set dialog data for cylinders and gas profiles
    if (dropList === 'gasProfileDropList') {
      console.log('hello')
      dialogData.cylinder2 = this.getCylindersList().filter(cylinder => cylinder.cylinderID === dropContainerItem['cylID'])[0];
      // dialogData.gasProfiles = [dropContainerItem];
      dialogData.gasProfiles = this.getGasProfilesList().filter(gasProfile => gasProfile.cylID === dialogData.cylinder2.cylinderID);
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
      cylinder: _cloneDeep(cylinder)
    }

    if(editSimilar) {
      dialogData.cylinder.cylinderID = '';
      dialogData.cylinder.id = null;
    }
    
    const dialogRef = this.dialog.open(EditCylinderDialogComponent, { data: dialogData });
    
    dialogRef.afterClosed().subscribe(data => {
      if(!data) return;
      // TODO: Fix the form to no add additional component gas which requires this shift method
      //if(!cylinder.id) cylinder.componentGases.shift();
      let currentCylinder = data.cyl;
      currentCylinder.id = data.cylID;
      this.saveCylinder(currentCylinder);
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

        const changedCylinder = _cloneDeep(cylinder);
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

    const gasProfileChange = _cloneDeep(gasProfile);
    gasProfileChange.cylID = '';

    this.updateGasProfile(gasProfileChange);
    this.saveCylinder(assignedCylinder);
  }

  availableFilteringAssign(item) {
    this.resetCrossCardFilters();

    item.componentGases.forEach(gas => {
      const newSingleConcentration = {
        cedarGasCode: gas.epaGasCode,
        concentration: gas.gasConcentration,
        uom: gas.uom,
        changed: null
      }
      this.assignCardFilters.cylinderFilters.gasCodes.push(gas.epaGasCode);
      this.assignCardFilters.cylinderFilters.singleConcentrations.push(newSingleConcentration);
      this.assignCardFilters.gasProfileFilters.gasCodes.push(gas.epaGasCode);
      this.assignCardFilters.gasProfileFilters.singleConcentrations.push(newSingleConcentration);
    });
    this.assignCardFilters = _cloneDeep(this.assignCardFilters);
  }

  assignFilteringAvailable(item) {
    this.resetCrossCardFilters();

    // filtering for gas profile
    if(item.tagID) {
      if(item.allowableGasValueMin && item.allowableGasValueMax) {
        this.availableCardFiltes.cylinderFilters.concentrations.push({
          cedarGasCode: item.cedarGasCode,
          allowableGasValueMin: item.allowableGasValueMin,
          allowableGasValueMax: item.allowableGasValueMax,
          uom: item.uom,
          changed: null
        });
      }
      if(item.allowableGasValueMin2 && item.allowableGasValueMax2) {
        this.availableCardFiltes.cylinderFilters.concentrations.push({
          cedarGasCode: item.cedarGasCode,
          allowableGasValueMin: item.allowableGasValueMin2,
          allowableGasValueMax: item.allowableGasValueMax2,
          uom: item.uom,
          changed: null
        });
      }
      this.availableCardFiltes.cylinderFilters.gasCodes.push(item.cedarGasCode);
    }
    // filtering for cylinder
    else {
      this.getGasProfilesList().forEach(gas => {
        if(gas.cylID === item.cylinderID) {
          if(gas.allowableGasValueMin && gas.allowableGasValueMax) {
            this.availableCardFiltes.cylinderFilters.concentrations.push({
              cedarGasCode: gas.cedarGasCode,
              allowableGasValueMin: gas.allowableGasValueMin,
              allowableGasValueMax: gas.allowableGasValueMax,
              uom: gas.uom,
              changed: null
            })
          }
          if(gas.allowableGasValueMin2 && gas.allowableGasValueMax2) {
            this.availableCardFiltes.cylinderFilters.concentrations.push({
              cedarGasCode: gas.cedarGasCode,
              allowableGasValueMin: gas.allowableGasValueMin2,
              allowableGasValueMax: gas.allowableGasValueMax2,
              uom: gas.uom,
              changed: null
            })
          }
        }
      })

      item.componentGases.forEach(gas => {
        this.availableCardFiltes.cylinderFilters.gasCodes.push(gas.epaGasCode);
      })
    }
    // remove duplicate concentration objects
    this.availableCardFiltes.cylinderFilters.concentrations = _uniqWith(this.availableCardFiltes.cylinderFilters.concentrations, _isEqual);
    this.availableCardFiltes = _cloneDeep(this.availableCardFiltes);
  }

  resetCrossCardFilters() {
    this.availableCardFiltes = {
      cylinderFilters: _cloneDeep(emptyCylinderFilters)
    };
    this.assignCardFilters = {
      cylinderFilters: _cloneDeep(emptyCylinderFilters),
      gasProfileFilters: _cloneDeep(emptyGasProfileFilters)
    };
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}



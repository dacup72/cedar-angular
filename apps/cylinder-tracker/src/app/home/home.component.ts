import { Component, OnInit } from '@angular/core';
import {
  CylindersFacade,
  Cylinder,
  GasProfilesFacade,
  QAGasProfile,
  UnitDefsFacade,
  UnitDef
} from '@cedar-all/core-data';
import { Observable } from 'rxjs';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { User } from '@cedar-angular/api-interfaces';
import { UserService } from '@cedar-all/core-data';
import { first } from 'rxjs/operators';
import { CylinderDropDialogComponent } from './cylinder-drop-dialog/cylinder-drop-dialog.component';
import { GasProfileUnassignDialogComponent } from './gas-profile-unassign-dialog/gas-profile-unassign-dialog.component';
//import { CylinderUnassignDialogComponent } from './cylinder-unassign-dialog/cylinder-unassign-dialog.component';
import { CylinderRetireDialogComponent } from './cylinder-retire-dialog/cylinder-retire-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cylinder-tracker-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedCylinder$: Observable<Cylinder> = this.cylindersFacade.selectedCylinder$;
  cylinders$: Observable<Cylinder[]> = this.cylindersFacade.allCylinders$;
  gasProfiles$: Observable<QAGasProfile[]> = this.gasProfilesFacade.allGasProfiles$;
  users: User[];
  unitDefs$: Observable<UnitDef[]> = this.unitDefsFacade.allUnitDefs$;

  loading = false;

  availableCardFiltes = {
    gasCodes: [],
    filterItem: ''
  }

  assignCardFilters = {
    gasCodes: [],
    filterItem: ''
  }

  constructor(
    private cylindersFacade: CylindersFacade,
    private userService: UserService,
    private gasProfilesFacade: GasProfilesFacade,
    private unitDefsFacade: UnitDefsFacade,
    private dialog: MatDialog
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
      cylinders.forEach(cylinder => cylindersOutput.push(Object.assign({}, cylinder)));
    });
    cylindersObs.unsubscribe();
    return cylindersOutput;
  }

  getGasProfilesList() {
    const gasProfilesOutput: QAGasProfile[] = [];
    const gasProfilesObs = this.gasProfiles$.subscribe(gasProfiles => {
      gasProfiles.forEach(gasProfile => gasProfilesOutput.push(Object.assign({}, gasProfile)));
    });
    gasProfilesObs.unsubscribe();
    return gasProfilesOutput;
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
    const draggedCylinder: Cylinder = Object.assign({}, event.item.data);
    const dropContainerItem = Object.assign({}, event.container.data[0]);

    if(draggedCylinder.cylinderID === dropContainerItem['cylinderID'])  return;

    // Cylinder dropped on Gas Profile
    if (dropContainerID.includes('gasProfileDropList')) {

      // If gas profile has no assigned cylinder
      if(!dropContainerItem['cylinderID']) this.validateCylinders(event, 'gasProfileDropList', draggedCylinder, dropContainerItem);
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
      gasProfiles: []
    }
    
    if (dropList === 'gasProfileDropList') {
      dialogData.cylinder2 = this.getCylindersList().filter(cylinder => cylinder.cylinderID === dropContainerItem['cylinderID'])[0];
      dialogData.gasProfiles = [dropContainerItem];
    }
    else if(dropList === 'inUseDropList') {
      dialogData.cylinder2 = dropContainerItem;
      dialogData.gasProfiles = this.getGasProfilesList().filter(gasProfile => gasProfile.cylID === dropContainerItem['cylinderID']);
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
      if(dropContainerItem['cylID'] && dropContainerItem['cylID'] !== draggedCylinder.cylinderID) {
        const previousAssignedCylinder = this.getCylindersList().filter(cylinder => cylinder.cylinderID === dropContainerItem['cylID'])[0];
        const previousAssignedGasProfiles = this.getGasProfilesList().filter(gasProfile => gasProfile.cylID === previousAssignedCylinder.cylinderID);
        
        previousAssignedCylinder.state = 'spare';

        // If previous assigned cylinder has more than 1 associated gas profile then it stays in use
        if(previousAssignedCylinder && previousAssignedGasProfiles.length > 1) {
          previousAssignedCylinder.state = 'inUse';
        }

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
      dropContainerItem['state'] = dialogOptions.selectedState;

      // Update the selected gas profiles
      this.getGasProfilesList().forEach(gasProfile => {
        if(dialogOptions.gasProfilesBeingChanged.includes(gasProfile.tagID)) {
          gasProfile.cylID = draggedCylinder.cylinderID;
          this.updateGasProfile(gasProfile);
        }
        else if(gasProfile.cylID === dropContainerItem['cylinderID']) {
          dropContainerItem['state'] = 'inUse';
        }
      });

      draggedCylinder.state = 'inUse';
      this.saveCylinder(dropContainerItem);
      this.saveCylinder(draggedCylinder);
    }
  }

  editCylinder(cylinder: Cylinder) {
    console.log('edit cylinder');
    // TODO: Create edit cylinder dialog
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

        const changedCylinder = Object.assign({}, cylinder);
        changedCylinder.state = 'retired';
        this.saveCylinder(changedCylinder);
      }
    });    
  }

  // unassignCylinder(cylinder: Cylinder) {
  //   const assignedGasProfiles = this.getGasProfilesList().filter(gasProfile => cylinder.cylinderID === gasProfile.cylinderID);

  //   const dialogRef = this.dialog.open(CylinderUnassignDialogComponent, {
  //     data: {
  //       cylinder: cylinder,
  //       gasProfiles: assignedGasProfiles
  //     }
  //   });

  //   // Remove cylinderID property from deselected gas profiles
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result) {

  //       // TODO: Need to optimize repeated code and clean up logic
  //       let openRetireQuestionDialog = true;

  //       for(const gasSelection in result) {
  //         if(result[gasSelection]) openRetireQuestionDialog = false;
  //       }

  //       if(openRetireQuestionDialog) {
  //         const dialogRef2 = this.dialog.open(GasProfileUnassignDialogComponent, {
  //           data: {
  //             cylinder: cylinder
  //           }
  //         });

  //         dialogRef2.afterClosed().subscribe(result2 => {
  //           const changedCylinder = Object.assign({}, cylinder);
  //           if(result2 === 'spare') {
  //             changedCylinder.state = 'spare';
  //             this.saveCylinder(changedCylinder);
  //           }
  //           else if(result2 === 'retire') {
  //             changedCylinder.state = 'retired';
  //             this.saveCylinder(changedCylinder);
  //           }
  //           else {
  //             return;
  //           }

  //           assignedGasProfiles.forEach(gasProfile => {
  //             if(!result[gasProfile.id]) {
  //               gasProfile.cylinderID = '';
  //               this.updateGasProfile(gasProfile);
  //             }
  //           })
  //         });
  //       }
  //       else {
  //         assignedGasProfiles.forEach(gasProfile => {
  //           if(!result[gasProfile.id]) {
  //             gasProfile.cylinderID = '';
  //             this.updateGasProfile(gasProfile);
  //           }
  //         })
  //       }
  //     }
  //   });
  // }

  // unassignGasProfile(gasProfile: QAGasProfile) {
  //   const assignedCylinder = Object.assign({}, this.getCylindersList().filter(cylinder => cylinder.cylinderID === gasProfile.cylinderID)[0]);
  //   let openDialog = true;

  //   // Check to see if cylinder is assigned to more than 1 gas profile
  //   this.getGasProfilesList().forEach(gasP => {
  //     if(gasP.id !== gasProfile.id && gasP.cylinderID === assignedCylinder.cylinderID) {
  //       this.finishUassignCylinder(assignedCylinder, gasProfile, 'inUse')
  //       openDialog = false;
  //     }
  //   });

  //   if(openDialog) this.openGasProfileUnassignDialog(assignedCylinder, gasProfile);
  // }

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

    const gasProfileChange = Object.assign({}, gasProfile);
    gasProfileChange.cylID = '';

    this.updateGasProfile(gasProfileChange);
    this.saveCylinder(assignedCylinder);
  }

  availableFilteringAssign(item) {
    const gases = item.epaGasTypeCodes ? item.epaGasTypeCodes : item.cedarGasTypeCodes;
    const filterItem = item.epaGasTypeCodes ? item.cylinderID : item.desc;
    this.assignCardFilters.gasCodes = gases;
    this.assignCardFilters.filterItem = filterItem;
    this.assignCardFilters = Object.assign({}, this.assignCardFilters);
  }

  assignFilteringAvailable(item) {
    const gases = item.epaGasTypeCodes ? item.epaGasTypeCodes : [item.cedarGasCode];
    const filterItem = item.epaGasTypeCodes ? item.cylinderID : item.desc;
    this.availableCardFiltes.gasCodes = gases;
    this.availableCardFiltes.filterItem = filterItem;
    this.availableCardFiltes = Object.assign({}, this.availableCardFiltes);
  }
}

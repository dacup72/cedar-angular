import { Component, OnInit } from '@angular/core';
import {
  CylindersFacade,
  Cylinder,
  GasProfilesFacade,
  QAGasProfile
} from '@cedar-all/core-data';
import { Observable } from 'rxjs';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { User } from '@cedar-angular/api-interfaces';
import { UserService } from '@cedar-all/core-data';
import { first } from 'rxjs/operators';
import { CylinderDropDialogComponent } from './cylinder-drop-dialog/cylinder-drop-dialog.component';
import { GasProfileUnassignDialogComponent } from './gas-profile-unassign-dialog/gas-profile-unassign-dialog.component';
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
  loading = false;

  constructor(
    private cylindersFacade: CylindersFacade,
    private userService: UserService,
    private gasProfilesFacade: GasProfilesFacade,
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
    this.resetSelectedCylinder();

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
    let cylindersOutput: Cylinder[];
    const cylindersObs = this.cylinders$.subscribe(cylinders => cylindersOutput = [...cylinders]);
    cylindersObs.unsubscribe();
    return cylindersOutput;
  }

  getGasProfilesList() {
    let gasProfilesOutput: QAGasProfile[];
    const gasProfilesObs = this.gasProfiles$.subscribe(gasProfiles => gasProfilesOutput = [...gasProfiles]);
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

    // Cylinder dropped on Gas Profile
    if (event.container.id.includes('gasProfileDropList')) {
      if(event.previousContainer.data[event.previousIndex]['cylinderID'] === event.container.data[0]['cylinderID']) return;

      // If gas profile has no assigned cylinder
      if(!event.container.data[0]['cylinderID']) this.validateCylinders(event);
      else this.openCylinderDroppedDialog(event);
    }
    // Cylinder dropped on in use cylinder
    else if(event.container.id.includes('inUseDropList')) {
      // TODO: Build the logic for dropping a cylinder on in use cylinder
      console.log('hello')
    }
  }

  openCylinderDroppedDialog(event: CdkDragDrop<string[]>) {
    const droppedCylinder = Object.assign({}, event.previousContainer.data[event.previousIndex]);
    let previousAssignedCylinder = null;
    let selectedGasProfile = null;
    
    if (event.container.id.includes('gasProfileDropList')) {
      selectedGasProfile = Object.assign({}, event.container.data[0]);
      previousAssignedCylinder = Object.assign({},
        this.getCylindersList().filter(cylinder => cylinder.cylinderID === selectedGasProfile['cylinderID'])[0]
      )
    }

    const dialogRef = this.dialog.open(CylinderDropDialogComponent, {
      data: {
        cylinder1: droppedCylinder,
        cylinder2: previousAssignedCylinder,
        gasProfiles: [selectedGasProfile]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) this.validateCylinders(event);
    });
  }

  //TODO: Fix the multiple component updates happening due to multiple state changing method calls
  validateCylinders(event: CdkDragDrop<string[]>) {
    const droppedCylinder = Object.assign({}, event.previousContainer.data[event.previousIndex]);

    // Transfer dropped cylinder to recieving array for smooth UI transition
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // Cylinder Dropped On Gas Profile
    if (event.container.id.includes('gasProfileDropList')) {
      const selectedGasProfile = Object.assign({}, event.container.data[1]);

      // If replaceing already assigned cylinder then find and update that cylinder
      if(selectedGasProfile['cylinderID'] !== droppedCylinder['cylinderID'] && selectedGasProfile['cylinderID']) {
        const previousAssignedCylinder = Object.assign({},
          this.getCylindersList().filter(cylinder => cylinder.cylinderID === selectedGasProfile['cylinderID'])[0]
        )
        if(previousAssignedCylinder) {

          // Check to see if cylinder is assigned to more than 1 gas profile
          this.getGasProfilesList().forEach(gasProfile => {
            if(gasProfile.id !== selectedGasProfile['id'] && gasProfile.cylinderID === previousAssignedCylinder.cylinderID) {
              previousAssignedCylinder.state = 'inUse';
            }
            else {
              previousAssignedCylinder.state = 'spare';
            }
          });
          this.saveCylinder(previousAssignedCylinder);
        } 
      }

      // Update the newely assigned cylinder and gas profile
      selectedGasProfile['cylinderID'] = droppedCylinder['cylinderID'];
      droppedCylinder['state'] = 'inUse';
      this.updateGasProfile(selectedGasProfile);
      this.saveCylinder(droppedCylinder);
    }
  }

  unassignCylinder(gasProfile: QAGasProfile) {
    const assignedCylinder = Object.assign({}, this.getCylindersList().filter(cylinder => cylinder.cylinderID === gasProfile.cylinderID)[0]);
    let openDialog = true;

    // Check to see if cylinder is assigned to more than 1 gas profile
    this.getGasProfilesList().forEach(gasP => {
      if(gasP.id !== gasProfile.id && gasP.cylinderID === assignedCylinder.cylinderID) {
        this.finishUassignCylinder(assignedCylinder, gasProfile, 'inUse')
        openDialog = false;
      }
    });

    if(openDialog) this.openGasProfileUnassignDialog(assignedCylinder, gasProfile);
  }

  openGasProfileUnassignDialog(assignedCylinder: Cylinder, gasProfile: QAGasProfile) {
    const dialogRef = this.dialog.open(GasProfileUnassignDialogComponent, {
      data: {
        cylinder: assignedCylinder
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) this.finishUassignCylinder(assignedCylinder, gasProfile, 'retired');
      else this.finishUassignCylinder(assignedCylinder, gasProfile, 'spare');
    });
  }

  finishUassignCylinder(assignedCylinder: Cylinder, gasProfile: QAGasProfile, action: string) {
    assignedCylinder.state = action;

    const gasProfileChange = Object.assign({}, gasProfile);
    gasProfileChange.cylinderID = '';

    this.updateGasProfile(gasProfileChange);
    this.saveCylinder(assignedCylinder);
  }
}

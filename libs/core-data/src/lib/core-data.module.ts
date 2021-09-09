import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CylindersService } from './cylinders/cylinders.service';
import { QAGasProfileService } from './qaGasProfiles/qa-gas-profile.service';
import { StateModule } from './state/state.module';
import { UserService } from './auth/user.service';
import { UnitDefService } from './unit-defs/unit-def.service';
import { CylinderTrackerStateService } from './cylinder-tracker/cylinder-tracker.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StateModule
  ],
  providers: [
    CylindersService,
    QAGasProfileService,
    UserService,
    UnitDefService,
    CylinderTrackerStateService
  ]
})
export class CoreDataModule {}

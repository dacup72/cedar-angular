import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NxModule } from '@nrwl/nx';

import { reducers } from '.';
import { CylindersEffects } from './cylinders/cylinders.effects';
import { GasProfilesEffects } from './gas-profiles/gas-profiles.effects';
import { UnitDefsEffects } from './unit-defs/unit-defs.effects';
import { CylinderTrackerEffects } from './cylinder-tracker/cylinder-tracker.effects';

@NgModule({
  imports: [
    CommonModule,
    NxModule.forRoot(),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({ maxAge: 10 }),
    EffectsModule.forRoot([
      CylindersEffects,
      GasProfilesEffects,
      UnitDefsEffects,
      CylinderTrackerEffects
    ]),
  ],
  declarations: []
})
export class StateModule { }

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';

import { UnitDef } from '@cedar-all/core-data';
import { UnitDefService } from './../../unit-defs/unit-def.service';
import {
  UnitDefsActionTypes,
  LoadUnitDefs,
  UnitDefsLoaded
} from './unit-defs.actions';
import { UnitDefsState } from './unit-defs.reducer';

@Injectable({ providedIn: 'root' })
export class UnitDefsEffects {
  @Effect() effect$ = this.actions$.pipe(ofType(UnitDefsActionTypes.UnitDefsAction));

  @Effect() loadUnitDefs$ = this.dataPersistence.fetch(
    UnitDefsActionTypes.LoadUnitDefs,
    {
      run: (action: LoadUnitDefs, state: UnitDefsState) => {
        return this.unitDefsService
          .getAllUnitDefs()
          .pipe(map((res: UnitDef[]) => new UnitDefsLoaded(res)));
      },
      onError: (action: LoadUnitDefs, error) => {
        console.error('Error', error);
      }
    }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<UnitDefsState>,
    private unitDefsService: UnitDefService
  ) {}
}

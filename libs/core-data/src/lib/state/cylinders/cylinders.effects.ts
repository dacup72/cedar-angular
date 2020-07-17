import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';

import { Cylinder } from './../../cylinders/cylinder.model';
import { CylindersService } from './../../cylinders/cylinders.service';
import {
  CylindersActionTypes,
  LoadCylinders,
  CylindersLoaded,
  CreateCylinder,
  CylinderCreated,
  UpdateCylinder,
  CylinderUpdated,
  DeleteCylinder,
  CylinderDeleted
} from './cylinders.actions';
import { CylindersState } from './cylinders.reducer';

@Injectable({ providedIn: 'root' })
export class CylindersEffects {
  @Effect() effect$ = this.actions$.pipe(ofType(CylindersActionTypes.CylindersAction));

  @Effect() loadCylinders$ = this.dataPersistence.fetch(
    CylindersActionTypes.LoadCylinders,
    {
      run: (action: LoadCylinders, state: CylindersState) => {
        return this.cylindersService
          .getAllCylinders()
          .pipe(map((res: Cylinder[]) => new CylindersLoaded(res)));
      },
      onError: (action: LoadCylinders, error) => {
        console.error('Error', error);
      }
    }
  );

  // Using pessimisticUpdate to wait for server to complete before dispatching to reducer
  // An optomisticUpdate just passes the object on to the reducer and if something goes wrong then it will let you know
  @Effect() createCylinder$ = this.dataPersistence.pessimisticUpdate(
    CylindersActionTypes.CreateCylinder,
    {
      run: (action: CreateCylinder, state: CylindersState) => {
        return this.cylindersService
          .createCylinder(action.payload)
          .pipe(map((res: Cylinder) => new CylinderCreated(res)));
      },
      onError: (action: CreateCylinder, error) => {
        console.error('Error', error);
      }
    }
  );

  @Effect() updateCylinder$ = this.dataPersistence.pessimisticUpdate(
    CylindersActionTypes.UpdateCylinder,
    {
      run: (action: UpdateCylinder, state: CylindersState) => {
        return this.cylindersService
          .updateCylinder(action.payload)
          .pipe(map((res: Cylinder) => new CylinderUpdated(res)));
      },
      onError: (action: UpdateCylinder, error) => {
        console.error('Error', error);
      }
    }
  );

  @Effect() deleteCylinder$ = this.dataPersistence.pessimisticUpdate(
    CylindersActionTypes.DeleteCylinder,
    {
      run: (action: DeleteCylinder, state: CylindersState) => {
        return this.cylindersService
          .deleteCylinder(action.payload)
          .pipe(map((res: Cylinder) => new CylinderDeleted(res)));
      },
      onError: (action: DeleteCylinder, error) => {
        console.error('Error', error);
      }
    }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<CylindersState>,
    private cylindersService: CylindersService
  ) {}
}

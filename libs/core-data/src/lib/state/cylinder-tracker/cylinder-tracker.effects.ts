import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';

import { CylinderTrackerAppState } from '@cedar-all/core-data';
import { CylinderTrackerStateService } from './../../cylinder-tracker/cylinder-tracker.service';
import {
  CylinderTrackerActionTypes,
  LoadCylinderTracker,
  CylinderTrackerLoaded,
  UpdateCylinderTracker,
  CylinderTrackerUpdated
} from './cylinder-tracker.actions';
import { CylinderTrackerState } from './cylinder-tracker.reducer';

@Injectable({ providedIn: 'root' })
export class CylinderTrackerEffects {
  @Effect() effect$ = this.actions$.pipe(ofType(CylinderTrackerActionTypes.CylinderTrackerAction));

  @Effect() loadCylinderTracker$ = this.dataPersistence.fetch(
    CylinderTrackerActionTypes.LoadCylinderTracker,
    {
      run: (action: LoadCylinderTracker, state: CylinderTrackerState) => {
        return this.cylinderTrackerService
          .getCylinderTrackerState()
          .pipe(map((res: CylinderTrackerAppState[]) => new CylinderTrackerLoaded(res)));
      },
      onError: (action: LoadCylinderTracker, error) => {
        console.error('Error', error);
      }
    }
  );

  @Effect() updateCylinderTracker$ = this.dataPersistence.pessimisticUpdate(
    CylinderTrackerActionTypes.UpdateCylinderTracker,
    {
      run: (action: UpdateCylinderTracker, state: CylinderTrackerState) => {
        return this.cylinderTrackerService
          .updateCylinderTrackerState(action.payload)
          .pipe(map((res: CylinderTrackerAppState) => new CylinderTrackerUpdated(res)));
      },
      onError: (action: UpdateCylinderTracker, error) => {
        console.error('Error', error);
      }
    }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<CylinderTrackerState>,
    private cylinderTrackerService: CylinderTrackerStateService
  ) {}
}

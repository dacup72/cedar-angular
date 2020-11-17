import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';

import { QAGasProfile } from '@cedar-all/core-data';
import { QAGasProfileService } from './../../qaGasProfiles/qa-gas-profile.service';
import {
  GasProfilesActionTypes,
  LoadGasProfiles,
  GasProfilesLoaded,
  UpdateGasProfile,
  GasProfileUpdated
} from './gas-profiles.actions';
import { GasProfilesState } from './gas-profiles.reducer';

@Injectable({ providedIn: 'root' })
export class GasProfilesEffects {
  @Effect() effect$ = this.actions$.pipe(ofType(GasProfilesActionTypes.GasProfilesAction));

  @Effect() loadGasProfiles$ = this.dataPersistence.fetch(
    GasProfilesActionTypes.LoadGasProfiles,
    {
      run: (action: LoadGasProfiles, state: GasProfilesState) => {
        return this.gasProfilesService
          .getAllGasProfiles()
          .pipe(map((res: QAGasProfile[]) => new GasProfilesLoaded(res)));
      },
      onError: (action: LoadGasProfiles, error) => {
        console.error('Error', error);
      }
    }
  );

  @Effect() updateGasProfile$ = this.dataPersistence.pessimisticUpdate(
    GasProfilesActionTypes.UpdateGasProfile,
    {
      run: (action: UpdateGasProfile, state: GasProfilesState) => {
        return this.gasProfilesService
          .updateQAGasProfile(action.payload)
          .pipe(map((res: QAGasProfile) => new GasProfileUpdated(res)));
      },
      onError: (action: UpdateGasProfile, error) => {
        console.error('Error', error);
      }
    }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<GasProfilesState>,
    private gasProfilesService: QAGasProfileService
  ) {}
}

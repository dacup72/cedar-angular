import { Injectable } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { GasProfilesState } from './gas-profiles.reducer';
import { selectAllGasProfiles, selectCurrentGasProfile } from '..';
import {
  LoadGasProfiles,
  UpdateGasProfile,
  SelectGasProfile,
  GasProfilesActionTypes
} from './gas-profiles.actions';

@Injectable({
  providedIn: 'root'
})
export class GasProfilesFacade {
  allGasProfiles$ = this.store.pipe(select(selectAllGasProfiles));
  selectedGasProfile$ = this.store.pipe(select(selectCurrentGasProfile));

  mutations$ = this.actions$.pipe(
    filter(action =>
      action.type === GasProfilesActionTypes.UpdateGasProfile
    )
  );

  constructor(private store: Store<GasProfilesState>, private actions$: ActionsSubject) { }

  selectGasProfile(cylinderId) {
    this.store.dispatch(new SelectGasProfile(cylinderId));
  }

  loadGasProfiles() {
    this.store.dispatch(new LoadGasProfiles());
  }

  updateGasProfile(cylinder) {
    this.store.dispatch(new UpdateGasProfile(cylinder));
  }
}

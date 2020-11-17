import { Action } from '@ngrx/store';
import { QAGasProfile } from '../../qaGasProfiles/qa-gas-profile.model'

export enum GasProfilesActionTypes {
  GasProfilesAction = '[GasProfiles] Action',
  GasProfileSelected = '[GasProfiles] Selected',
  LoadGasProfiles = '[GasProfiles] Load Data',
  GasProfilesLoaded = '[GasProfiles] Data Loaded',
  UpdateGasProfile = '[GasProfiles] Update Data',
  GasProfileUpdated = '[GasProfiles] Data Updated'
}

export class GasProfiles implements Action {
  readonly type = GasProfilesActionTypes.GasProfilesAction;
}

export class SelectGasProfile implements Action {
  readonly type = GasProfilesActionTypes.GasProfileSelected;
  constructor(public payload: QAGasProfile) {}
}

export class LoadGasProfiles implements Action {
  readonly type = GasProfilesActionTypes.LoadGasProfiles;
  constructor() { }
}

export class GasProfilesLoaded implements Action {
  readonly type = GasProfilesActionTypes.GasProfilesLoaded;
  constructor(public payload: QAGasProfile[]) {}
}

export class UpdateGasProfile implements Action {
  readonly type = GasProfilesActionTypes.UpdateGasProfile;
  constructor(public payload: QAGasProfile) {}
}

export class GasProfileUpdated implements Action {
  readonly type = GasProfilesActionTypes.GasProfileUpdated;
  constructor(public payload: QAGasProfile) {}
}

// This is typescript saying that GasProfileActions can be one of many types
export type GasProfileActions = GasProfiles
  | SelectGasProfile
  | LoadGasProfiles
  | GasProfilesLoaded
  | UpdateGasProfile
  | GasProfileUpdated;
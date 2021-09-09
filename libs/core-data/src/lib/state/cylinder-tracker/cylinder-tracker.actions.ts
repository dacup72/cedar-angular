import { Action } from '@ngrx/store';
import { CylinderTrackerAppState } from '@cedar-all/core-data';

export enum CylinderTrackerActionTypes {
  CylinderTrackerAction = '[CylinderTracker] Action',
  LoadCylinderTracker = '[CylinderTracker] Load Data',
  CylinderTrackerLoaded = '[CylinderTracker] Data Loaded',
  UpdateCylinderTracker = '[CylinderTracker] Update Data',
  CylinderTrackerUpdated = '[CylinderTracker] Data Updated'
}

export class CylinderTracker implements Action {
  readonly type = CylinderTrackerActionTypes.CylinderTrackerAction;
}

export class LoadCylinderTracker implements Action {
  readonly type = CylinderTrackerActionTypes.LoadCylinderTracker;
  constructor() { }
}

export class CylinderTrackerLoaded implements Action {
  readonly type = CylinderTrackerActionTypes.CylinderTrackerLoaded;
  constructor(public payload: CylinderTrackerAppState[]) {}
}

export class UpdateCylinderTracker implements Action {
    readonly type = CylinderTrackerActionTypes.UpdateCylinderTracker;
    constructor(public payload: CylinderTrackerAppState) {}
  }
  
  export class CylinderTrackerUpdated implements Action {
    readonly type = CylinderTrackerActionTypes.CylinderTrackerUpdated;
    constructor(public payload: CylinderTrackerAppState) {}
  }

// This is typescript saying that CylinderTrackerActions can be one of many types
export type CylinderTrackerActions = CylinderTracker
  | LoadCylinderTracker
  | CylinderTrackerLoaded
  | UpdateCylinderTracker
  | CylinderTrackerUpdated;

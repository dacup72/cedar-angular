import { Action } from '@ngrx/store';
import { UnitDef } from '../../unit-defs/unit-def.model'

export enum UnitDefsActionTypes {
  UnitDefsAction = '[UnitDefs] Action',
  LoadUnitDefs = '[UnitDefs] Load Data',
  UnitDefsLoaded = '[UnitDefs] Data Loaded',
}

export class UnitDefs implements Action {
  readonly type = UnitDefsActionTypes.UnitDefsAction;
}

export class LoadUnitDefs implements Action {
  readonly type = UnitDefsActionTypes.LoadUnitDefs;
  constructor() { }
}

export class UnitDefsLoaded implements Action {
  readonly type = UnitDefsActionTypes.UnitDefsLoaded;
  constructor(public payload: UnitDef[]) {}
}

// This is typescript saying that UnitDefActions can be one of many types
export type UnitDefActions = UnitDefs
  | LoadUnitDefs
  | UnitDefsLoaded;

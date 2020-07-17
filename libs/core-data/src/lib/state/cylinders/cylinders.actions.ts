import { Action } from '@ngrx/store';
import { Cylinder } from '../../cylinders/cylinder.model';

export enum CylindersActionTypes {
  CylindersAction = '[Cylinders] Action',
  CylinderSelected = '[Cylinders] Selected',
  LoadCylinders = '[Cylinders] Load Data',
  CylindersLoaded = '[Cylinders] Data Loaded',
  CreateCylinder = '[Cylinders] Create Data',
  CylinderCreated = '[Cylinders] Data Created',
  UpdateCylinder = '[Cylinders] Update Data',
  CylinderUpdated = '[Cylinders] Data Updated',
  DeleteCylinder = '[Cylinders] Delete Data',
  CylinderDeleted = '[Cylinders] Data Deleted'
}

export class Cylinders implements Action {
  readonly type = CylindersActionTypes.CylindersAction;
}

export class SelectCylinder implements Action {
  readonly type = CylindersActionTypes.CylinderSelected;
  constructor(public payload: Cylinder) {}
}

export class LoadCylinders implements Action {
  readonly type = CylindersActionTypes.LoadCylinders;
  constructor() { }
}

export class CylindersLoaded implements Action {
  readonly type = CylindersActionTypes.CylindersLoaded;
  constructor(public payload: Cylinder[]) {}
}

export class CreateCylinder implements Action {
  readonly type = CylindersActionTypes.CreateCylinder;
  constructor(public payload: Cylinder) {}
}

export class CylinderCreated implements Action {
  readonly type = CylindersActionTypes.CylinderCreated;
  constructor(public payload: Cylinder) {}
}

export class UpdateCylinder implements Action {
  readonly type = CylindersActionTypes.UpdateCylinder;
  constructor(public payload: Cylinder) {}
}

export class CylinderUpdated implements Action {
  readonly type = CylindersActionTypes.CylinderUpdated;
  constructor(public payload: Cylinder) {}
}

export class DeleteCylinder implements Action {
  readonly type = CylindersActionTypes.DeleteCylinder;
  constructor(public payload: Cylinder) {}
}

export class CylinderDeleted implements Action {
  readonly type = CylindersActionTypes.CylinderDeleted;
  constructor(public payload: Cylinder) {}
}

// This is typescript saying that CylinderActions can be one of many types
export type CylinderActions = Cylinders
  | SelectCylinder
  | LoadCylinders
  | CylindersLoaded
  | CreateCylinder
  | CylinderCreated
  | UpdateCylinder
  | CylinderUpdated
  | DeleteCylinder
  | CylinderDeleted;
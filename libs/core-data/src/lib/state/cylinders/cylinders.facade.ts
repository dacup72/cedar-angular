import { Injectable } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { CylindersState } from './cylinders.reducer';
import { selectAllCylinders, selectCurrentCylinder } from '..';
import {
  LoadCylinders,
  CreateCylinder,
  UpdateCylinder,
  DeleteCylinder,
  SelectCylinder,
  CylindersActionTypes
} from './cylinders.actions';

@Injectable({
  providedIn: 'root'
})
export class CylindersFacade {
  allCylinders$ = this.store.pipe(select(selectAllCylinders));
  selectedCylinder$ = this.store.pipe(select(selectCurrentCylinder));

  mutations$ = this.actions$.pipe(
    filter(action =>
      action.type === CylindersActionTypes.CreateCylinder
      || action.type === CylindersActionTypes.UpdateCylinder
      || action.type === CylindersActionTypes.DeleteCylinder
    )
  );

  constructor(private store: Store<CylindersState>, private actions$: ActionsSubject) { }

  selectCylinder(cylinderId) {
    this.store.dispatch(new SelectCylinder(cylinderId))
  }

  loadCylinders() {
    this.store.dispatch(new LoadCylinders());
  }

  createCylinder(cylinder) {
    this.store.dispatch(new CreateCylinder(cylinder));
  }

  updateCylinder(cylinder) {
    this.store.dispatch(new UpdateCylinder(cylinder));
  }

  deleteCylinder(cylinder) {
    this.store.dispatch(new DeleteCylinder(cylinder));
  }
}

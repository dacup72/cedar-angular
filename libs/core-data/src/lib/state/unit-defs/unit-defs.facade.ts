import { Injectable } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { UnitDefsState } from './unit-defs.reducer';
import { selectAllUnitDefs } from '..';
import { LoadUnitDefs } from './unit-defs.actions';

@Injectable({
  providedIn: 'root'
})
export class UnitDefsFacade {
  allUnitDefs$ = this.store.pipe(select(selectAllUnitDefs));

  constructor(private store: Store<UnitDefsState>) { }

  loadUnitDefs() {
    this.store.dispatch(new LoadUnitDefs());
  }
}

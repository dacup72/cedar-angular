import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CylinderTrackerState } from './cylinder-tracker.reducer';
import { selectCylinderTracker } from '..';
import { LoadCylinderTracker, UpdateCylinderTracker } from './cylinder-tracker.actions';

@Injectable({
  providedIn: 'root'
})
export class CylinderTrackerFacade {
  cylinderTrackerAppState$ = this.store.pipe(select(selectCylinderTracker));

  constructor(private store: Store<CylinderTrackerState>) { }

  loadCylinderTrackerState() {
    this.store.dispatch(new LoadCylinderTracker());
  }

  updateCylinderTrackerState(state) {
    this.store.dispatch(new UpdateCylinderTracker(state));
  }
}

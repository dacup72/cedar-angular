import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import * as fromCylinders from './cylinders/cylinders.reducer';
import { Cylinder } from '../cylinders/cylinder.model';

// Update the shape of the entire application state
export interface AppState {
  cylinders: fromCylinders.CylindersState;
}

// Add in the feature reducer into a combined reducer
export const reducers: ActionReducerMap<AppState> = {
  cylinders: fromCylinders.cylindersReducers
};

// CYLINDERS SELECTORS
export const selectCylinderState = createFeatureSelector<fromCylinders.CylindersState>('cylinders');

export const selectCylinderIds = createSelector(
  selectCylinderState,
  fromCylinders.selectCylinderIds
);

export const selectCylinderEntities = createSelector(
  selectCylinderState,
  fromCylinders.selectCylinderEntities
);

export const selectAllCylinders = createSelector(
  selectCylinderState,
  fromCylinders.selectAllCylinders
);

export const selectCurrentCylinderId = createSelector(
  selectCylinderState,
  fromCylinders.getSelectedCylinderId
);

export const emptyCylinder: Cylinder = {
  id: null,
  cylinderID: '',
  expDate: '',
  vendorID: '',
  epaGasCodes: [],
  componentGases: [
    {
      name: '',
      amount: 0,
      amountType: ''
    }
  ],
  status: 'spare'
};

export const selectCurrentCylinder = createSelector(
  selectCylinderEntities,
  selectCurrentCylinderId,
  (cylinderEntities, cylinderId) => {
    return cylinderId ? cylinderEntities[cylinderId] : emptyCylinder;
  }
);

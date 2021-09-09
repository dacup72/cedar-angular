import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import * as fromCylinders from './cylinders/cylinders.reducer';
import * as fromGasProfiles from './gas-profiles/gas-profiles.reducer';
import * as fromUnitDefs from './unit-defs/unit-defs.reducer';
import * as fromCylinderTracker from './cylinder-tracker/cylinder-tracker.reducer';
import { emptyCylinder } from '../cylinders/cylinder.model';
import { emptyGasProfile } from '../qaGasProfiles/qa-gas-profile.model';


// Update the shape of the entire application state
export interface AppState {
  cylinders: fromCylinders.CylindersState;
  gasProfiles: fromGasProfiles.GasProfilesState;
  unitDefs: fromUnitDefs.UnitDefsState;
  cylinderTracker: fromCylinderTracker.CylinderTrackerState;
}

// Add in the feature reducer into a combined reducer
export const reducers: ActionReducerMap<AppState> = {
  cylinders: fromCylinders.cylindersReducers,
  gasProfiles: fromGasProfiles.gasProfilesReducers,
  unitDefs: fromUnitDefs.unitDefsReducers,
  cylinderTracker: fromCylinderTracker.CylinderTrackerReducers
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

export const selectCurrentCylinder = createSelector(
  selectCylinderEntities,
  selectCurrentCylinderId,
  (cylinderEntities, cylinderId) => {
    return cylinderId ? cylinderEntities[cylinderId] : emptyCylinder;
  }
);



// GAS PROFILES SELECTORS
export const selectGasProfileState = createFeatureSelector<fromGasProfiles.GasProfilesState>('gasProfiles');

export const selectGasProfileIds = createSelector(
  selectGasProfileState,
  fromGasProfiles.selectGasProfileIds
);

export const selectGasProfileEntities = createSelector(
  selectGasProfileState,
  fromGasProfiles.selectGasProfileEntities
);

export const selectAllGasProfiles = createSelector(
  selectGasProfileState,
  fromGasProfiles.selectAllGasProfiles
);

export const selectCurrentGasProfileId = createSelector(
  selectGasProfileState,
  fromGasProfiles.getSelectedGasProfileId
);

export const selectCurrentGasProfile = createSelector(
  selectGasProfileEntities,
  selectCurrentGasProfileId,
  (gasProfileEntities, gasProfileId) => {
    return gasProfileId ? gasProfileEntities[gasProfileId] : emptyGasProfile;
  }
);



// UNIT DEF SELECTORS
export const selectUnitDefState = createFeatureSelector<fromUnitDefs.UnitDefsState>('unitDefs');

export const selectAllUnitDefs = createSelector(
  selectUnitDefState,
  fromUnitDefs.selectAllUnitDefs
);



// CYLINDER TRACKER STATE SELECTORS
export const selectCylinderTrackerState = createFeatureSelector<fromCylinderTracker.CylinderTrackerState>('cylinderTracker');

export const selectCylinderTracker = createSelector(
  selectCylinderTrackerState,
  fromCylinderTracker.selectCylinderTracker
);
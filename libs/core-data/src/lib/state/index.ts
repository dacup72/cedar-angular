import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import * as fromCylinders from './cylinders/cylinders.reducer';
import * as fromGasProfiles from './gas-profiles/gas-profiles.reducer';
import { Cylinder } from '../cylinders/cylinder.model';
import { QAGasProfile } from '../qaGasProfiles/qa-gas-profile.model';


// Update the shape of the entire application state
export interface AppState {
  cylinders: fromCylinders.CylindersState;
  gasProfiles: fromGasProfiles.GasProfilesState;
}

// Add in the feature reducer into a combined reducer
export const reducers: ActionReducerMap<AppState> = {
  cylinders: fromCylinders.cylindersReducers,
  gasProfiles: fromGasProfiles.gasProfilesReducers
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
  expirationDate: '',
  vendorID: '',
  epaGasTypeCodes: [],
  componentGases: [
    {
      qaGasDefCode: '',
      epaGasCode: '',
      gasConcentration: 0,
      uom: ''
    }
  ],
  state: 'spare',
  certificationImage: '',
  hasBeenUsedForQA: false,
  createdByPartialEdit: false,
  editHistory: '',
  errorList: []
};

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

export const emptyGasProfile: QAGasProfile = {
    id: null,
    pid: 0,
    name: '',
    unitNumber: 0,
    cedarGasCode: '',
    analyzerSpanType: '',
    qaTestType: '',
    gasLevel: '',
    uom: '',
    instrumentSpan: 0,
    minAllowableGasValue: 0,
    maxAllowableGasValue: 0,
    gasConcentration: 0,
    cylinderID: '',
    expirationDate: '',
    vendorID: '',
    epaGasTypeCode: '',
    errorList: []
};

export const selectCurrentGasProfile = createSelector(
  selectGasProfileEntities,
  selectCurrentGasProfileId,
  (gasProfileEntities, gasProfileId) => {
    return gasProfileId ? gasProfileEntities[gasProfileId] : emptyGasProfile;
  }
);



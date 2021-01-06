import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import * as fromCylinders from './cylinders/cylinders.reducer';
import * as fromGasProfiles from './gas-profiles/gas-profiles.reducer';
import * as fromUnitDefs from './unit-defs/unit-defs.reducer';
import { Cylinder } from '../cylinders/cylinder.model';
import { QAGasProfile } from '../qaGasProfiles/qa-gas-profile.model';
import { UnitDef } from '../unit-defs/unit-def.model';


// Update the shape of the entire application state
export interface AppState {
  cylinders: fromCylinders.CylindersState;
  gasProfiles: fromGasProfiles.GasProfilesState;
  unitDefs: fromUnitDefs.UnitDefsState;
}

// Add in the feature reducer into a combined reducer
export const reducers: ActionReducerMap<AppState> = {
  cylinders: fromCylinders.cylindersReducers,
  gasProfiles: fromGasProfiles.gasProfilesReducers,
  unitDefs: fromUnitDefs.unitDefsReducers
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
  "tagID": null,
  "desc": "",
  "unit": "",
  "cedarGasCode": "",
  "analyzerSpanType": "",
  "qaTestType": "",
  "gasLevel": "",
  "uom": "",
  "instSpan": "",
  "allowableGasValueMin": "",
  "allowableGasValueMax": "",
  "cylGasConc": "",
  "cylID": "",
  "cylExpDate": "",
  "cylVendorID": "",
  "cylEpaGasTypeCode": "",
  "cylPressure": "",
  "cylPressureUOM": "",
  "errorInfo": []
};

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

export const emptyUnitDef: UnitDef = {
  "id": null,
  "name": "",
};

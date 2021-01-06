import { QAGasProfile } from '../../qaGasProfiles/qa-gas-profile.model';
import { GasProfilesActionTypes, GasProfileActions } from './gas-profiles.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// Define the shape of the state
export interface GasProfilesState extends EntityState<QAGasProfile> {
  selectedGasProfileId: string | null;
}

// Create entity adapter
// The adapter handles immutability of objects and commiting actions on the state
export const adapter: EntityAdapter<QAGasProfile> = createEntityAdapter<QAGasProfile>({
  selectId: (gasProfileModel: QAGasProfile) => gasProfileModel.tagID
})

// Define the initial state
export const initialState: GasProfilesState = adapter.getInitialState({
  selectedGasProfileId: null
})

// Reducers
export function gasProfilesReducers(
  state = initialState,
  action: GasProfileActions
): GasProfilesState {
  switch (action.type) {
    case GasProfilesActionTypes.GasProfileSelected:
     return Object.assign({}, state, { selectedGasProfileId: action.payload });

    case GasProfilesActionTypes.GasProfilesLoaded:
      return adapter.setAll(action.payload, state);

    case GasProfilesActionTypes.GasProfileUpdated:
      return adapter.upsertOne(action.payload, state);

      
      
    default:
      return state;
  }
}

// Selectors
export const getSelectedGasProfileId = (state: GasProfilesState) => state.selectedGasProfileId;

const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

export const selectGasProfileIds = selectIds;
export const selectGasProfileEntities = selectEntities;
export const selectAllGasProfiles = selectAll;
export const selectGasProfileTotal = selectTotal;
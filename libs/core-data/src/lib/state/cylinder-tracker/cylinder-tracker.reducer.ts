import { CylinderTrackerAppState } from '@cedar-all/core-data';
import { CylinderTrackerActionTypes, CylinderTrackerActions } from './cylinder-tracker.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// Define the shape of the state
export interface CylinderTrackerState extends EntityState<CylinderTrackerAppState> {}

// Create entity adapter
// The adapter handles immutability of objects and commiting actions on the state
export const adapter: EntityAdapter<CylinderTrackerAppState> = createEntityAdapter<CylinderTrackerAppState>()

// Define the initial state
export const initialState: CylinderTrackerState = adapter.getInitialState({})

// Reducers
export function CylinderTrackerReducers(
  state = initialState,
  action: CylinderTrackerActions
): CylinderTrackerState {
  switch (action.type) {
    case CylinderTrackerActionTypes.CylinderTrackerLoaded:
      return adapter.setAll(action.payload, state);

    case CylinderTrackerActionTypes.CylinderTrackerUpdated:
        return adapter.upsertOne(action.payload, state);
      
    default:
      return state;
  }
}

const { selectAll } = adapter.getSelectors();

export const selectCylinderTracker = selectAll;

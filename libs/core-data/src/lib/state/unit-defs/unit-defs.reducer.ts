import { UnitDef } from '../../unit-defs/unit-def.model';
import { UnitDefsActionTypes, UnitDefActions } from './unit-defs.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// Define the shape of the state
export interface UnitDefsState extends EntityState<UnitDef> {}

// Create entity adapter
// The adapter handles immutability of objects and commiting actions on the state
export const adapter: EntityAdapter<UnitDef> = createEntityAdapter<UnitDef>()

// Define the initial state
export const initialState: UnitDefsState = adapter.getInitialState({})

// Reducers
export function unitDefsReducers(
  state = initialState,
  action: UnitDefActions
): UnitDefsState {
  switch (action.type) {
    case UnitDefsActionTypes.UnitDefsLoaded:
      return adapter.setAll(action.payload, state);
      
    default:
      return state;
  }
}

const { selectAll } = adapter.getSelectors();

export const selectAllUnitDefs = selectAll;

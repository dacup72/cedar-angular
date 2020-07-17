import { Cylinder } from './../../cylinders/cylinder.model';
import { CylindersActionTypes, CylinderActions } from './cylinders.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// Define the shape of the state
export interface CylindersState extends EntityState<Cylinder> {
  selectedCylinderId: string | null;
}

// Create entity adapter
// The adapter handles immutability of objects and commiting actions on the state
export const adapter: EntityAdapter<Cylinder> = createEntityAdapter<Cylinder>()

// Define the initial state
export const initialState: CylindersState = adapter.getInitialState({
  selectedCylinderId: null
})

// Reducers
export function cylindersReducers(
  state = initialState,
  action: CylinderActions
): CylindersState {
  switch (action.type) {
    case CylindersActionTypes.CylinderSelected:
     return Object.assign({}, state, { selectedCylinderId: action.payload });

    case CylindersActionTypes.CylindersLoaded:
      return adapter.setAll(action.payload, state);

    case CylindersActionTypes.CylinderCreated:
      return adapter.addOne(action.payload, state);

    case CylindersActionTypes.CylinderUpdated:
      return adapter.upsertOne(action.payload, state);

    case CylindersActionTypes.CylinderDeleted:
      return adapter.removeOne(action.payload.id, state);
      
    default:
      return state;
  }
}

// Selectors
export const getSelectedCylinderId = (state: CylindersState) => state.selectedCylinderId;

const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

export const selectCylinderIds = selectIds;
export const selectCylinderEntities = selectEntities;
export const selectAllCylinders = selectAll;
export const selectCylinderTotal = selectTotal;
/* @flow */
// We will put all the grid level reducers into this file
// So that we do not have to call the dropdown's API's again and again
// If the dropdown is already loaded, we will not dispatch its action again

import {
    LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID_STARTED,
    LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID,
} from 'store/actions/grid/gridActions';
import Immutable from 'app/utils/immutable/Immutable';

/**
 * Classification List reducer for grid.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
export default (state: Object = Immutable({ isLoading: false, records: [], total: 0 }), action: Object) => {
    const { type, payload, error } = action;
    switch ( type ) {
        case LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID_STARTED:
            return Immutable({ ...state, isLoading: true });

        case LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID:
            if(error) return Immutable({ ...state, isLoading: false });
            const { records, total } = payload;
            return Immutable({
                ...state,
                isLoading: false,
                records,
                total
            });

        default:
            return state;
    }
};

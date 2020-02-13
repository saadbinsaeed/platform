/* @flow */

import { SAVE_DATATABLE_STATUS } from 'store/actions/grid/gridActions';
import Immutable, { set } from 'app/utils/immutable/Immutable';

/**
 * Handle the DataTable application runtime state.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
export default (state: Object = Immutable({}), action: Object) => {
    const { type, payload } = action;

    switch ( type ) {
        case SAVE_DATATABLE_STATUS:
            return set(state, payload.id, payload.status);

        default:
            return state;
    }
};

/* @flow */

import { LOAD_GROUPS, LOAD_GROUPS_STARTED } from 'store/actions/admin/groupsActions';
import Immutable from 'app/utils/immutable/Immutable';

/**
 * Groups reducer.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (state: Object = Immutable({ isLoading: true, records: [] }), action: Object) => {
    const { type, payload, error } = action;
    switch ( type ) {
        case LOAD_GROUPS_STARTED:
            return Immutable({ ...state, isLoading: true });
        case LOAD_GROUPS:
            if(error){
                return Immutable({ ...state, isLoading: false });
            }
            const { records } = payload;
            return Immutable({ ...state, records, isLoading: false });
        default:
            return state;
    }
};

export default reducer;

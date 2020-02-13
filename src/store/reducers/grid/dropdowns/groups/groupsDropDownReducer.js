/* @flow */

import {
    LOAD_GROUP_DROPDOWN_OPTIONS_STARTED,
    LOAD_GROUP_DROPDOWN_OPTIONS,
} from 'store/actions/grid/gridActions';

import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';

/**
 * Classification List reducer for grid.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
export default (state: Object = Immutable({ isLoading: false, records: null, count: 0 }), { type, payload }: Object) => {
    switch ( type ) {
        case LOAD_GROUP_DROPDOWN_OPTIONS_STARTED:
            return Immutable({ ...state, isLoading: true, records: null });

        case LOAD_GROUP_DROPDOWN_OPTIONS:
            return Immutable({ ...state, isLoading: false, records: get(payload, 'records') });

        default:
            return state;
    }
};

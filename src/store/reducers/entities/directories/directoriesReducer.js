/* @flow */

import {
    LOAD_DIRECTORIES_STARTED,
    LOAD_DIRECTORIES,
} from 'store/actions/common/DirectoriesActions';
import Immutable from 'app/utils/immutable/Immutable';

/**
 * Directories reducer.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (state: Object = Immutable({}), action: Object) => {

    switch ( action.type ) {
        case LOAD_DIRECTORIES_STARTED:
            return Immutable({ ...state, isLoading: true });

        case LOAD_DIRECTORIES:
            return Immutable({ ...state, [action.meta.directoryType]: action.payload, isLoading: false });

        default:
            return state;
    }
};

export default reducer;

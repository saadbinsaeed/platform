/* @flow */

import Immutable from 'app/utils/immutable/Immutable';

/**
 * Browser history reducer.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (state: Object = Immutable({ list: [] }), action: Object) => {

    switch ( action.type ) {
        case '@@router/LOCATION_CHANGE': {
            const list = [
                {
                    action: action.payload.action,
                    pathname: action.payload.pathname,
                    search: action.payload.search,
                },
                ...state.list
            ];
            if (list.length > 10) {
                list.pop(); // discards the oldest element
            }
            return Immutable({ ...state, list });
        }
        default:
            return state;
    }
};

export default reducer;

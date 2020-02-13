/* @flow */

import { LOCATION_CHANGE } from 'react-router-redux';

import Immutable from 'app/utils/immutable/Immutable';

const initialState = Immutable({
    location: {
        action: null,
        pathname: '',
        search: null,
    }
});

/**
 * Router history reducer.
 *
 * @param state the current Redux state.
 * @param action the dispatched action.
 *
 * @return the new Redux state.
 */
const router: Function = ( state: Object = initialState, action: Object ): Object => {

    if ( action.type === LOCATION_CHANGE ) {
        const previousLocation = state.location;
        return Immutable({ ...state, location: action.payload, previousLocation });
    }
    return state;

};

export default router;

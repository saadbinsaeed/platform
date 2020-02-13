/* @flow */

import { SITUATIONAL_AWARENESS_STARTED, SITUATIONAL_AWARENESS } from 'store/actions/maps/situationalAwarenessActions';
import Immutable from 'app/utils/immutable/Immutable';

/**
 * The initial state on our reducer
 */
const initialState = {
    isLoading: false,
    payload: [],
};

/**
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (state: Object = Immutable(initialState), action: Object) => {
    // console.log('reducerState', state, 'reducerAction', action);
    const { type, error, payload = {} } = action;
    switch ( type ) {
        case SITUATIONAL_AWARENESS_STARTED:
            return Immutable({ ...state, isLoading: true });

        case SITUATIONAL_AWARENESS:
            if (error) {
                return { isLoading: false };
            }
            return Immutable({
                ...state,
                isLoading: false,
                payload,
            });
        default:
            return state;
    }
};

export default reducer;

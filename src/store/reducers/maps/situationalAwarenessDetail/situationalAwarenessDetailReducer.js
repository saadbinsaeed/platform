/* @flow */

import { SITUATIONAL_AWARENESS_DETAIL_STARTED, SITUATIONAL_AWARENESS_DETAIL } from 'store/actions/maps/situationalAwarenessDetailActions';
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
        case SITUATIONAL_AWARENESS_DETAIL_STARTED:
            return Immutable({ ...state, isLoading: true });

        case SITUATIONAL_AWARENESS_DETAIL:
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

/* @flow */

import { LOAD_EVENT_PROCESSES_STARTED, LOAD_EVENT_PROCESSES } from 'store/actions/stream/eventsActions';
import Immutable from 'app/utils/immutable/Immutable';


const defaultState = Immutable({
    isLoading: false,
    list: [],
});

/**
 * Event Processes reducer.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (state: Object = defaultState, { type, payload, meta, error }: Object) => {

    switch (type) {
        case LOAD_EVENT_PROCESSES_STARTED:
            return Immutable({ ...state, isLoading: true, list: [] });

        case LOAD_EVENT_PROCESSES: {
            if (error) {
                return Immutable({ ...state, isLoading: false });
            }
            return Immutable({ ...state, isLoading: false, list: payload.list || [] });
        }
        default:
            return state;
    }
};

export default reducer;

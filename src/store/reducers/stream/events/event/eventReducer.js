/* @flow */

import { EVENT_START_PROCESS_STARTED, EVENT_START_PROCESS, UPDATE_EVENT_STATUS_STARTED, UPDATE_EVENT_STATUS } from 'store/actions/stream/eventsActions';
import Immutable from 'app/utils/immutable/Immutable';


/**
 * Event reducer.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (state: Object = Immutable({ updatingStatus: false, startingProcess: false }), action: Object) => {

    switch ( action.type ) {
        case UPDATE_EVENT_STATUS_STARTED:
            return Immutable({ ...state, updatingStatus: true });

        case UPDATE_EVENT_STATUS:
            return Immutable({ ...state, updatingStatus: false });

        case EVENT_START_PROCESS_STARTED:
            return Immutable({ ...state, startingProcess: true });

        case EVENT_START_PROCESS:
            return Immutable({ ...state, startingProcess: false });
        default:
            return state;
    }
};

export default reducer;

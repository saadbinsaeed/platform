/* @flow */
import Immutable from 'app/utils/immutable/Immutable';
import { LOAD_NOTIFICATIONS_STARTED, LOAD_NOTIFICATIONS } from 'store/actions/app/appActions';
import { GET_ACTIVE_BROADCASTS_STARTED, GET_ACTIVE_BROADCASTS } from 'store/actions/broadcasts/broadcastsActions';

const reducer = (state: Object = Immutable({ isLoading: false, records: [] }), action: Object) => {
    const { type, error, payload = {} } = action;
    switch ( type ) {
        case GET_ACTIVE_BROADCASTS_STARTED: case LOAD_NOTIFICATIONS_STARTED:
            return Immutable({ ...state, isLoading: true });

        case GET_ACTIVE_BROADCASTS: case LOAD_NOTIFICATIONS:
            if (error) {
                return Immutable({ isLoading: false });
            }
            return Immutable({ ...state, isLoading: false, records: payload.broadcasts });

        default:
            return state;
    }
};

export default reducer;

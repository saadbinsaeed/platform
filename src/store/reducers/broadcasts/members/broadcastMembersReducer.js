/* @flow */
import { GET_BROADCAST_MEMBERS_STARTED, GET_BROADCAST_MEMBERS, EXPAND_BROADCAST_MEMEBERS } from 'store/actions/broadcasts/broadcastsActions';
import Immutable from 'app/utils/immutable/Immutable';
import { set } from 'app/utils/lo/lo';

const reducer = (state: Object = Immutable({ expandedRows: {} }), { type, error, payload, meta }: Object) => {
    switch ( type ) {
        case GET_BROADCAST_MEMBERS_STARTED:
            if (!meta.broadcastId) {
                throw new Error('Ths broadcastId is mandatory.');
            }
            return Immutable({ ...state, [meta.broadcastId]: { isLoading: true } });

        case GET_BROADCAST_MEMBERS: {
            if (!meta.broadcastId) {
                throw new Error('Ths broadcastId is mandatory.');
            }
            const { data } = payload || {};
            if (error || !data) {
                return Immutable({ ...state, [meta.broadcastId]: { isLoading: false } });
            }
            return Immutable({ ...state, [meta.broadcastId]: { isLoading: false, data } });
        }

        case EXPAND_BROADCAST_MEMEBERS:
            if (!payload.broadcastId) {
                throw new Error('Ths broadcastId is mandatory.');
            }
            return set(state, `expandedRows.${payload.broadcastId}`, payload.expandedRows);

        default:
            return state;
    }
};

export default reducer;

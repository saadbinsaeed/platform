/* @flow */
import {
    LOAD_EXPANDED_PROCESS_STARTED,
    LOAD_EXPANDED_PROCESS,
} from 'store/actions/abox/processActions';
import Immutable from 'app/utils/immutable/Immutable';

/**
 * Reducer to handle app actions
 * @param state
 * @param action
 * @returns {*}
 */
export default (state: Object = Immutable({}), { type, payload, error, meta }: Object) => {
    switch (type) {
        case LOAD_EXPANDED_PROCESS_STARTED:
            return Immutable({ ...state, [meta.processId]: { isLoading: true } });

        case LOAD_EXPANDED_PROCESS: {
            if (error) return Immutable({ ...state, [meta.processId]: { isLoading: false } });
            const data = payload || [];
            return Immutable({ ...state, [meta.processId]: { isLoading: false, data } });
        }
        default:
            return state;
    }
};

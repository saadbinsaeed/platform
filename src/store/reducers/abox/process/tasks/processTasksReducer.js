/* @flow */
import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import {
    LOAD_PROCESS_TASKS_STARTED, LOAD_PROCESS_TASKS
} from 'store/actions/abox/taskActions';

export default (state: Object = {}, action: Object = {}) => {
    const { type, payload, error, meta } = action;
    switch (type) {
        case LOAD_PROCESS_TASKS_STARTED: {
            const { processId } = meta || {};
            let processTasksState = get(state, processId) || {};
            processTasksState = { ...processTasksState, isLoading: true };
            return Immutable({ ...state, [processId]: processTasksState });
        }
        case LOAD_PROCESS_TASKS: {
            const { processId } = meta || {};
            let processTasksState = get(state, processId) || {};
            if (error) {
                processTasksState = { ...processTasksState, isLoading: false };
            } else {
                processTasksState = { ...processTasksState, isLoading: false, data: payload };
            }
            return Immutable({ ...state, [processId]: processTasksState });
        }
        default:
            return state;
    }
};

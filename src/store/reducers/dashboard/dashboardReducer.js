/* @flow */
import { combineReducers } from 'redux';

import { dataTableReducer } from 'app/utils/redux/reducer-utils';
import {
    LOAD_TASKS_ASSIGNED_STARTED, LOAD_TASKS_ASSIGNED,
    LOAD_TASKS_OWNED_STARTED, LOAD_TASKS_OWNED,
    LOAD_TASKS_FOLLOWING_STARTED, LOAD_TASKS_FOLLOWING,
    LOAD_TASKS_DONE_STARTED, LOAD_TASKS_DONE,
    LOAD_PROCESSES_ASSIGNED_STARTED, LOAD_PROCESSES_ASSIGNED,
    LOAD_PROCESSES_OWNED_STARTED, LOAD_PROCESSES_OWNED,
    LOAD_PROCESSES_DONE_STARTED, LOAD_PROCESSES_DONE,
    LOAD_PROCESSES_FOLLOWING_STARTED, LOAD_PROCESSES_FOLLOWING
} from 'store/actions/dashboard/dashboardActions';

export default combineReducers({
    tasksAssigned: dataTableReducer(LOAD_TASKS_ASSIGNED_STARTED, LOAD_TASKS_ASSIGNED, () => true),
    tasksOwned: dataTableReducer(LOAD_TASKS_OWNED_STARTED, LOAD_TASKS_OWNED, () => true),
    tasksMemberOf: dataTableReducer(LOAD_TASKS_FOLLOWING_STARTED, LOAD_TASKS_FOLLOWING, () => true),
    tasksDone: dataTableReducer(LOAD_TASKS_DONE_STARTED, LOAD_TASKS_DONE, () => true),
    processesAssigned: dataTableReducer(LOAD_PROCESSES_ASSIGNED_STARTED, LOAD_PROCESSES_ASSIGNED, () => true),
    processesOwned: dataTableReducer(LOAD_PROCESSES_OWNED_STARTED, LOAD_PROCESSES_OWNED, () => true),
    processesMemberOf: dataTableReducer(LOAD_PROCESSES_FOLLOWING_STARTED, LOAD_PROCESSES_FOLLOWING, () => true),
    processesDone: dataTableReducer(LOAD_PROCESSES_DONE_STARTED, LOAD_PROCESSES_DONE, () => true)
});

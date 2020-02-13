import { combineReducers } from 'redux';

import { dataTableReducer, loadDataReducer, compareId, truthful } from 'app/utils/redux/reducer-utils';
import {
    LOAD_TASK_DETAILS_STARTED, LOAD_TASK_DETAILS,
    OUTDATE_TASK_DETAILS,
    LOAD_SUBTASKS_STARTED, LOAD_SUBTASKS,
    LOAD_TASKS_STARTED, LOAD_TASKS,
    LOAD_CALENDAR_TASKS_STARTED, LOAD_CALENDAR_TASKS,
    LOAD_TIMELINE_TASKS_STARTED, LOAD_TIMELINE_TASKS,
    LOAD_TASK_CHANGELOG_STARTED, LOAD_TASK_CHANGELOG,
    ADD_TEAM_MEMBER_STARTED, ADD_TEAM_MEMBER,
} from 'store/actions/abox/taskActions';

const taskReducer = combineReducers({
    timeline: dataTableReducer(LOAD_TIMELINE_TASKS_STARTED, LOAD_TIMELINE_TASKS, () => true),
    calendar: dataTableReducer(LOAD_CALENDAR_TASKS_STARTED, LOAD_CALENDAR_TASKS, () => true),
    changelog: loadDataReducer(LOAD_TASK_CHANGELOG_STARTED, LOAD_TASK_CHANGELOG, truthful),
    details: loadDataReducer(LOAD_TASK_DETAILS_STARTED, LOAD_TASK_DETAILS, compareId),
    detailsOutdated: (state = false, { type, payload }) => type === OUTDATE_TASK_DETAILS ? payload : state,
    list: dataTableReducer(LOAD_TASKS_STARTED, LOAD_TASKS, () => true),
    subtasks: dataTableReducer(LOAD_SUBTASKS_STARTED, LOAD_SUBTASKS, () => true),
    addTeamMembers: loadDataReducer(ADD_TEAM_MEMBER_STARTED, ADD_TEAM_MEMBER),
});

export default taskReducer;

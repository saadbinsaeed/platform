/* @flow */
import { combineReducers } from 'redux';

import { loadDataReducer, compareId, truthful } from 'app/utils/redux/reducer-utils';
import {
    LOAD_PROCESS_DETAILS_STARTED, LOAD_PROCESS_DETAILS,
    OUTDATE_PROCESS_DETAILS,
    LOAD_SUBPROCESSES_STARTED, LOAD_SUBPROCESSES,
    LOAD_PROCESS_CHANGELOG_STARTED, LOAD_PROCESS_CHANGELOG,
    LOAD_STARTED_PROCESS_DETAILS_STARTED, LOAD_STARTED_PROCESS_DETAILS,
    ADD_TEAM_MEMBER_STARTED, ADD_TEAM_MEMBER,
} from 'store/actions/abox/processActions';
import tasks from './tasks/processTasksReducer';

const processReducer = combineReducers({
    changelog: loadDataReducer(LOAD_PROCESS_CHANGELOG_STARTED, LOAD_PROCESS_CHANGELOG, truthful),
    children: loadDataReducer(LOAD_SUBPROCESSES_STARTED, LOAD_SUBPROCESSES),
    details: loadDataReducer(LOAD_PROCESS_DETAILS_STARTED, LOAD_PROCESS_DETAILS, compareId),
    detailsOutdated: (state = false, { type, payload }) => type === OUTDATE_PROCESS_DETAILS ? payload : state,
    started: loadDataReducer(LOAD_STARTED_PROCESS_DETAILS_STARTED, LOAD_STARTED_PROCESS_DETAILS),
    addTeamMembers: loadDataReducer(ADD_TEAM_MEMBER_STARTED, ADD_TEAM_MEMBER),
    tasks,
});

export default processReducer;

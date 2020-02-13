// @flow
import { combineReducers } from 'redux';

import { dataTableReducer, loadDataReducer } from 'app/utils/redux/reducer-utils';
import { GET_ABOX_RELATIONSHIPS_STARTED, GET_ABOX_RELATIONSHIPS } from 'store/actions/abox/aboxActions';
import { LOAD_ABOX_ATTACHMENTS_STARTED, LOAD_ABOX_ATTACHMENTS } from 'store/actions/abox/aboxActions';
import { OUTDATE_ABOX_ATTACHMENTS } from 'store/actions/abox/aboxActions';
import { LOAD_PROCESSES_STARTED, LOAD_PROCESSES } from 'store/actions/abox/processActions';
import { LOAD_PROCESSES_CARDS_STARTED, LOAD_PROCESSES_CARDS } from 'store/actions/abox/processActions';

import { LOAD_ABOX_PROCESS_DEFINITION_STARTED, LOAD_ABOX_PROCESS_DEFINITION } from 'store/actions/abox/myAppsActions';

import expanded from './expanded/aboxExpandedProcessReducer';
import process from './process/processReducer';
import app from './app/appReducer';
import task from './task/taskReducer';
import timeline from './timeline/timelineReducer';

const aboxReducer = combineReducers({
    app,
    list: dataTableReducer(LOAD_PROCESSES_STARTED, LOAD_PROCESSES),
    processesCards: dataTableReducer(LOAD_PROCESSES_CARDS_STARTED, LOAD_PROCESSES_CARDS, () => true),
    attachments: dataTableReducer(LOAD_ABOX_ATTACHMENTS_STARTED, LOAD_ABOX_ATTACHMENTS, () => true),
    attachmentsOutdated: (state = false, { type, payload }) => type === OUTDATE_ABOX_ATTACHMENTS ? payload : state,
    relationships: dataTableReducer(GET_ABOX_RELATIONSHIPS_STARTED, GET_ABOX_RELATIONSHIPS, () => true),
    processDefinition: loadDataReducer(LOAD_ABOX_PROCESS_DEFINITION_STARTED, LOAD_ABOX_PROCESS_DEFINITION),
    expanded,
    process,
    task,
    timeline
});

export default aboxReducer;

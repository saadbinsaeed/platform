/* @flow */
import { combineReducers } from 'redux';

import { LOAD_EVENTS_STARTED, LOAD_EVENTS } from 'store/actions/stream/eventsActions';
import { dataTableReducer } from 'app/utils/redux/reducer-utils';

import processes from './processes/eventProcessesReducer';
import event from './event/eventReducer';

export default combineReducers({
    event,
    processes,
    list: dataTableReducer(LOAD_EVENTS_STARTED, LOAD_EVENTS),
});

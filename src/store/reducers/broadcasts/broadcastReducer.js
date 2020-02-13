/* @flow */

import { combineReducers } from 'redux';

import { dataTableReducer, loadDataReducer } from 'app/utils/redux/reducer-utils';
import { GET_BROADCAST_STARTED, GET_BROADCAST } from 'store/actions/broadcasts/broadcastsActions';
import { GET_BROADCASTS_STARTED, GET_BROADCASTS } from 'store/actions/broadcasts/broadcastsActions';
import { GET_BROADCASTS_CALENDAR_STARTED, GET_BROADCASTS_CALENDAR } from 'store/actions/broadcasts/broadcastsActions';
import { SAVE_BROADCAST_STARTED, SAVE_BROADCAST } from 'store/actions/broadcasts/broadcastsActions';

import active from './active/activeBroadcastsReducer';
import members from './members/broadcastMembersReducer';

export default combineReducers({
    active,
    calendar: loadDataReducer(GET_BROADCASTS_CALENDAR_STARTED, GET_BROADCASTS_CALENDAR),
    detail: loadDataReducer(GET_BROADCAST_STARTED, GET_BROADCAST),
    list: dataTableReducer(GET_BROADCASTS_STARTED, GET_BROADCASTS),
    members,
    save: loadDataReducer(SAVE_BROADCAST_STARTED, SAVE_BROADCAST),
});

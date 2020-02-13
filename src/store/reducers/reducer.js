/* @flow */

/**
 * Each folder in this directory structure /reducers represents a slice
 * of the application state. Navigating this directory structure should be
 * the equivalent of navigating the app state.
 */
import { combineReducers } from 'redux';

import abox from './abox/aboxReducers';
import admin from './admin/adminReducer';
import app from './app/appReducer';
import routing from './routing/routerHistoryReducer';
import user from './user/userReducer';
import broadcasts from './broadcasts/broadcastReducer';
import chat from './messenger/messengerReducer';
import common from './common/commonReducer';
import global from './global/globalReducer';
// $FlowFixMe
import { reducer as stream } from 'platform-mi-stream-module';
// import stream from './stream/streamReducer';

const rootReducer = combineReducers({
    abox,
    admin,
    app,
    user,
    chat,
    broadcasts,
    common,
    routing,
    global,
    stream
});

export default rootReducer;

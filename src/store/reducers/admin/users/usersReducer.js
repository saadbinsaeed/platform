/* @flow */
import { combineReducers } from 'redux';

import { dataTableReducer, loadDataReducer, compareId } from 'app/utils/redux/reducer-utils';
import {
    LOAD_USERS_MANAGEMENT_STARTED, LOAD_USERS_MANAGEMENT,
    LOAD_USER_STARTED, LOAD_USER,
    LOAD_USER_HISTORY_STARTED, LOAD_USER_HISTORY
} from 'store/actions/admin/userManagementAction';
import user from './user/userReducer';

export default combineReducers({
    user,
    details: loadDataReducer(LOAD_USER_STARTED, LOAD_USER, compareId),
    changelog: loadDataReducer(LOAD_USER_HISTORY_STARTED, LOAD_USER_HISTORY, compareId),
    userlist: dataTableReducer(LOAD_USERS_MANAGEMENT_STARTED, LOAD_USERS_MANAGEMENT),
});

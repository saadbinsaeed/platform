/* @flow */

import { combineReducers } from 'redux';

import { loadDataReducer } from 'app/utils/redux/reducer-utils';
import { LOAD_USER_SELECT_STARTED, LOAD_USER_SELECT } from 'store/actions/admin/usersActions';

export default combineReducers({
    user: loadDataReducer(LOAD_USER_SELECT_STARTED, LOAD_USER_SELECT),
});

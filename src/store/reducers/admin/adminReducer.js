import { combineReducers } from 'redux';
import groups from './groups/groupsReducer';
import users from './users/usersReducer';

export default combineReducers({
    groups,
    users
});

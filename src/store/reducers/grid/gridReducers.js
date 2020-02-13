/* @flow */
import { combineReducers } from 'redux';
import classifications from 'store/reducers/grid/dropdowns/classifications/classificationsDropDownReducer';
import groups from 'store/reducers/grid/dropdowns/groups/groupsDropDownReducer';
import organisations from 'store/reducers/grid/dropdowns/organisations/organisationsDropDownReducer';
import state from 'store/reducers/grid/state/gridStateReducer';

const dropdowns = combineReducers({
    classifications,
    groups,
    organisations,
});

export default combineReducers({
    dropdowns,
    state,
});

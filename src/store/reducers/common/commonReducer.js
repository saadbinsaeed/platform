/* @flow */

import { combineReducers } from 'redux';
import autocomplete from './autocomplete/autocompleteReducer';
import calendar from './calendar/calendarReducer';
import multiselect from './multiselect/multiselectReducer';
import select from './select/selectReducer';

export default combineReducers({
    autocomplete,
    calendar,
    multiselect,
    select,
});

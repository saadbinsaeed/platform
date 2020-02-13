import { combineReducers } from 'redux';

import list from './list/appListReducer';

import { loadDataReducer } from 'app/utils/redux/reducer-utils';
import {
    LOAD_TYPEAHEAD_PROCESS_DEFINITIONS,
    LOAD_TYPEAHEAD_PROCESS_DEFINITIONS_STARTED,
} from 'store/actions/abox/myAppsActions';

const appReducer = combineReducers({
    list,
    typeaheadProcessDefinitions: loadDataReducer(LOAD_TYPEAHEAD_PROCESS_DEFINITIONS_STARTED, LOAD_TYPEAHEAD_PROCESS_DEFINITIONS),
});

export default appReducer;

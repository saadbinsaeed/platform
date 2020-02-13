/* @flow */
import { combineReducers } from 'redux';

import { dataTableReducer, loadDataReducer } from 'app/utils/redux/reducer-utils';
import {
    LOAD_FORMS_DEFINITIONS_STARTED, LOAD_FORMS_DEFINITIONS,
    LOAD_FORM_DEFINITION_STARTED, LOAD_FORM_DEFINITION,
} from 'store/actions/designer/designerActions';

export default combineReducers({
    forms: dataTableReducer(LOAD_FORMS_DEFINITIONS_STARTED, LOAD_FORMS_DEFINITIONS, () => true),
    form: loadDataReducer(LOAD_FORM_DEFINITION_STARTED, LOAD_FORM_DEFINITION),
});

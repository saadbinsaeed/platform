/* @flow */
import { combineReducers } from 'redux';

import { dataTableReducer, loadDataReducer } from 'app/utils/redux/reducer-utils';
import { LOAD_CLASSIFICATIONS_STARTED, LOAD_CLASSIFICATIONS } from 'store/actions/classifications/classificationsActions';
import {
    LOAD_CLASSIFICATION_STARTED,
    LOAD_CLASSIFICATION,
    LOAD_CLASSIFICATION_ENTITIES_STARTED,
    LOAD_CLASSIFICATION_ENTITIES,
    CREATE_CLASSIFICATION_STARTED,
    CREATE_CLASSIFICATION,
    UPDATE_CLASSIFICATION_STARTED,
    UPDATE_CLASSIFICATION,
} from 'store/actions/classifications/classificationsActions';

export default combineReducers({
    details: loadDataReducer(LOAD_CLASSIFICATION_STARTED, LOAD_CLASSIFICATION),
    update: loadDataReducer(UPDATE_CLASSIFICATION_STARTED, UPDATE_CLASSIFICATION),
    list: dataTableReducer(LOAD_CLASSIFICATIONS_STARTED, LOAD_CLASSIFICATIONS),
    entities: dataTableReducer(LOAD_CLASSIFICATION_ENTITIES_STARTED, LOAD_CLASSIFICATION_ENTITIES),
    addedClassification: loadDataReducer(CREATE_CLASSIFICATION_STARTED, CREATE_CLASSIFICATION)
});

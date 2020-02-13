/* @flow */

import { combineReducers } from 'redux';

import { loadDataReducer } from 'app/utils/redux/reducer-utils';
import {
    LOAD_ENTITY_CLASSES_AND_ATTRIBUTES_STARTED,
    LOAD_ENTITY_CLASSES_AND_ATTRIBUTES,
    UPDATE_ENTITY_ATTRIBUTES_STARTED,
    UPDATE_ENTITY_ATTRIBUTES,
} from 'store/actions/entities/common/entityAttributesActions';

const commonClassificationsReducer = combineReducers({
    classifications: loadDataReducer(LOAD_ENTITY_CLASSES_AND_ATTRIBUTES_STARTED, LOAD_ENTITY_CLASSES_AND_ATTRIBUTES),
    attributes: loadDataReducer(UPDATE_ENTITY_ATTRIBUTES_STARTED, UPDATE_ENTITY_ATTRIBUTES),
});

export default commonClassificationsReducer;

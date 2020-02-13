/* @flow */
import { combineReducers } from 'redux';

import {
    LOAD_CUSTOM_ENTITIES_LIST_STARTED,
    LOAD_CUSTOM_ENTITIES_LIST,
    CUSTOM_ENTITY_SAVE_STARTED,
    CUSTOM_ENTITY_SAVE,
    LOAD_CUSTOM_ENTITY_CHILDREN_STARTED,
    LOAD_CUSTOM_ENTITY_CHILDREN,
    LOAD_CUSTOM_ENTITY_DETAILS_STARTED,
    LOAD_CUSTOM_ENTITY_DETAILS
} from 'store/actions/entities/customEntitiesActions';
import { dataTableReducer, loadDataReducer } from 'app/utils/redux/reducer-utils';
import { getStr } from 'app/utils/utils';

export default combineReducers({
    details: loadDataReducer(LOAD_CUSTOM_ENTITY_DETAILS_STARTED, LOAD_CUSTOM_ENTITY_DETAILS, ({ state, meta }: Object) => getStr(state, 'data.customEntity.id') === getStr(meta,'id')),
    children: loadDataReducer(LOAD_CUSTOM_ENTITY_CHILDREN_STARTED, LOAD_CUSTOM_ENTITY_CHILDREN),
    list: dataTableReducer(LOAD_CUSTOM_ENTITIES_LIST_STARTED, LOAD_CUSTOM_ENTITIES_LIST),
    save: loadDataReducer(CUSTOM_ENTITY_SAVE_STARTED, CUSTOM_ENTITY_SAVE)
});

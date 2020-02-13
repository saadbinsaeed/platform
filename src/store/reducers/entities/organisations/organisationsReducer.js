/* @flow */

import { combineReducers } from 'redux';

import { dataTableReducer, loadDataReducer } from 'app/utils/redux/reducer-utils';
import {
    LOAD_ORGANISATIONS_STARTED,
    LOAD_ORGANISATIONS,
    LOAD_ORGANISATION_STARTED,
    LOAD_ORGANISATION,
    SAVE_ORGANISATION_STARTED,
    SAVE_ORGANISATION,
    LOAD_ORGANISATION_CHILDREN_STARTED,
    LOAD_ORGANISATION_CHILDREN,
} from 'store/actions/entities/organisationsActions';
import { getStr } from 'app/utils/utils';

export default combineReducers({
    details: loadDataReducer(LOAD_ORGANISATION_STARTED, LOAD_ORGANISATION, ({ state, meta }: Object) => getStr(state, 'data.organisation.id') === getStr(meta,'id')),
    save: loadDataReducer(SAVE_ORGANISATION_STARTED, SAVE_ORGANISATION),
    list: dataTableReducer(LOAD_ORGANISATIONS_STARTED, LOAD_ORGANISATIONS),
    children:  loadDataReducer(LOAD_ORGANISATION_CHILDREN_STARTED, LOAD_ORGANISATION_CHILDREN),
});

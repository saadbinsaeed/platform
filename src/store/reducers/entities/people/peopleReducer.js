/* @flow */
import { combineReducers } from 'redux';

import {
    LOAD_PEOPLE_LIST_STARTED,
    LOAD_PEOPLE_LIST,
    LOAD_PERSON_STARTED,
    LOAD_PERSON,
    UPDATE_PERSON_STARTED,
    UPDATE_PERSON
} from 'store/actions/entities/peopleActions';
import { dataTableReducer, loadDataReducer } from 'app/utils/redux/reducer-utils';
import { getStr } from 'app/utils/utils';

export default combineReducers({
    save: loadDataReducer(UPDATE_PERSON_STARTED, UPDATE_PERSON),
    details: loadDataReducer(LOAD_PERSON_STARTED, LOAD_PERSON, ({ state, meta }: Object) => getStr(state, 'data.person.id') === getStr(meta,'id')),
    list: dataTableReducer(LOAD_PEOPLE_LIST_STARTED, LOAD_PEOPLE_LIST),
});

/* @flow */
import { combineReducers } from 'redux';

import { dataTableReducer, loadDataReducer } from 'app/utils/redux/reducer-utils';
import {
    LOAD_THINGS_GRID_STARTED, LOAD_THINGS_GRID,
    LOAD_THING_STARTED, LOAD_THING,
    THING_SAVE_STARTED, THING_SAVE,
    LOAD_CHILDREN_STARTED, LOAD_CHILDREN,
} from 'store/actions/entities/thingsActions';
import { getStr } from 'app/utils/utils';

export default combineReducers({
    details: loadDataReducer(LOAD_THING_STARTED, LOAD_THING, ({ state, meta }: Object) => getStr(state, 'data.thing.id') === getStr(meta,'id')),
    list: dataTableReducer(LOAD_THINGS_GRID_STARTED, LOAD_THINGS_GRID),
    children: loadDataReducer(LOAD_CHILDREN_STARTED, LOAD_CHILDREN),
    save: loadDataReducer(THING_SAVE_STARTED, THING_SAVE),
});

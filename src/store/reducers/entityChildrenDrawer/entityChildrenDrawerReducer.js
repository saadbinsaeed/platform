/* @flow */

import { loadDataReducer } from 'app/utils/redux/reducer-utils';
import {
    LOAD_ENTITY_CHILDREN_DRAWER, LOAD_ENTITY_CHILDREN_DRAWER_CURRENT_ID,
    LOAD_ENTITY_CHILDREN_DRAWER_START,
    TOGGLE_ENTITY_CHILDREN_DRAWER,
} from 'store/actions/entityChildrenDrawer/entityChildrenDrawerActions';

type DsType = {
    isLoading: boolean,
    isOpen: boolean,
    data: Object,
    currentId: ?number,
};

const DEFAULT_STATE: DsType = {
    isLoading: false,
    isOpen: false,
    data: {},
    currentId: null,
};

export default (state: DsType = DEFAULT_STATE, action: Object) => {
    const { type, payload } = action || {};

    switch (type) {
        case LOAD_ENTITY_CHILDREN_DRAWER_START:
        case LOAD_ENTITY_CHILDREN_DRAWER:
            return loadDataReducer(LOAD_ENTITY_CHILDREN_DRAWER_START, LOAD_ENTITY_CHILDREN_DRAWER)(state, action);
        case TOGGLE_ENTITY_CHILDREN_DRAWER:
            return { ...state, isOpen: !!payload };
        case LOAD_ENTITY_CHILDREN_DRAWER_CURRENT_ID:
            return { ...state, currentId: payload };
        default:
            return state;
    }
};

/* @flow */

import { loadData } from 'app/utils/redux/action-utils';
import entityChildrenDrawerQuery from 'graphql/entities/common/childrenDrawer/entityChildrenDrawerQuery';

export const LOAD_ENTITY_CHILDREN_DRAWER_START = '@@affectli/entityChildrenDrawer/LOAD_ENTITY_CHILDREN_DRAWER_START';
export const LOAD_ENTITY_CHILDREN_DRAWER = '@@affectli/entityChildrenDrawer/LOAD_ENTITY_CHILDREN_DRAWER';

export const TOGGLE_ENTITY_CHILDREN_DRAWER = '@@affectli/entityChildrenDrawer/TOGGLE_ENTITY_CHILDREN_DRAWER';

export const LOAD_ENTITY_CHILDREN_DRAWER_CURRENT_ID= '@@affectli/entityChildrenDrawer/LOAD_ENTITY_CHILDREN_DRAWER_CURRENT_ID';

export const loadEntityChildrenDrawer = (id: Number | null) => (dispatch: Function, getState: Function): Promise<?Object> => {
    dispatch({ type: LOAD_ENTITY_CHILDREN_DRAWER_CURRENT_ID, payload: id });
    if (id === null) {
        dispatch({ type: LOAD_ENTITY_CHILDREN_DRAWER_START });
        dispatch({ type: LOAD_ENTITY_CHILDREN_DRAWER, payload: null });
        return Promise.resolve(null);
    }
    const queryOptions = { id, filterBy: [{ field: 'parent.id', op: '=', value: id }] };
    return loadData(LOAD_ENTITY_CHILDREN_DRAWER_START, LOAD_ENTITY_CHILDREN_DRAWER, entityChildrenDrawerQuery)(queryOptions)(dispatch, getState);
};

export const toggleEntityChildrenDrawer = (open: ?boolean) => (dispatch: Function, getState: Function) => {
    const isOpen = open !== undefined ? open : !getState().entityChildrenDrawer.isOpen;
    return dispatch({ type: TOGGLE_ENTITY_CHILDREN_DRAWER, payload: isOpen });
};

export const openEntityChildrenDrawer = toggleEntityChildrenDrawer.bind(null, true);
export const closeEntityChildrenDrawer = toggleEntityChildrenDrawer.bind(null, false);

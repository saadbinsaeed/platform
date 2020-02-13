/* @flow */
import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';

import classificationsSelectQuery from 'graphql/entities/classifications/classificationsSelectQuery';
import groupsSelectQuery from 'graphql/groups/groupsSelectQuery';
import organisationsSelectQuery from 'graphql/entities/entities/organisationsSelectQuery';

export const LOAD_CLASSIFICATIONS_DROPDOWN_FOR_GRID_STARTED = '@@affectli/entities/things/classifications/LOAD_CLASSIFICATIONS_DROPDOWN_FOR_GRID_STARTED';
export const LOAD_CLASSIFICATIONS_DROPDOWN_FOR_GRID = '@@affectli/entities/things/classifications/LOAD_CLASSIFICATIONS_DROPDOWN_FOR_GRID';

export const LOAD_GROUP_DROPDOWN_OPTIONS_STARTED = '@@affectli/entities/things/classifications/LOAD_GROUP_DROPDOWN_OPTIONS_STARTED';
export const LOAD_GROUP_DROPDOWN_OPTIONS = '@@affectli/entities/things/classifications/LOAD_GROUP_DROPDOWN_OPTIONS';
export const LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID_STARTED = '@@affectli/entities/LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID_STARTED';
export const LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID = '@@affectli/entities/LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID';

export const SAVE_DATATABLE_STATUS = '@@affectli/grid/status/SAVE_DATATABLE_STATUS';


/**
 * Save the runtime state of a DataTable.
 *
 * @param id the DataTable ID.
 * @param status the DataTable's status.
 */
export const saveDataTableState = (id: string, status: Object) => (dispatch: Function) => {
    if (!id) {
        return;
    }
    dispatch({ type: SAVE_DATATABLE_STATUS, payload: Immutable({ id, status }) });
};


/**
 * Load classifications for grid header
 *
 * @param variables: { page, itemsPerPage, filterBy, orderBy }
 */
export const loadClassificationsDropDownForGrid = (variables: Object = { page: 1, itemsPerPage: 1000, filterBy: [{ field: 'active', op: '=', value: true }] }) => {
    return (dispatch: Function): void => {
        dispatch({ type: LOAD_CLASSIFICATIONS_DROPDOWN_FOR_GRID_STARTED });
        graphql.query({
            query: classificationsSelectQuery,
            variables,
            fetchPolicy: 'no-cache',
        }).then((response) => {
            dispatch({ type: LOAD_CLASSIFICATIONS_DROPDOWN_FOR_GRID, payload: Immutable(get(response, 'data')) });
        }).catch((error) => {
            dispatch({ type: LOAD_CLASSIFICATIONS_DROPDOWN_FOR_GRID, payload: error, error: true });
        });
    };
};

export const loadGroupDropdownOptions = ({ page = 1, pageSize = 1000, orderBy, where, fields }: Object = {}) => {
    return ( dispatch: Function ): void => {
        dispatch({ type: LOAD_GROUP_DROPDOWN_OPTIONS_STARTED });
        graphql.query({
            query: groupsSelectQuery,
            variables: { page, pageSize, orderBy, where, fields },
            fetchPolicy: 'no-cache',
        }).then((response) => {
            dispatch({ type: LOAD_GROUP_DROPDOWN_OPTIONS, payload: Immutable(get(response, 'data')) });
        }).catch((error) => {
            dispatch({ type: LOAD_GROUP_DROPDOWN_OPTIONS, payload: error, error: true });
        });
    };
};

export const loadOrganisationsDropdownForGrid = (variables: Object = {}) => {
    return (dispatch: Function): void => {
        dispatch({ type: LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID_STARTED });
        const filterByNullName = { field: 'name', op: 'is not null' };
        if(variables.where) {
            variables.where.push(filterByNullName);
        } else {
            variables.where = [ filterByNullName ];
        }
        const orderByName = { field: 'name', direction: 'asc' };
        if (variables.orderBy) {
            variables.orderBy.push(orderByName);
        } else {
            variables.orderBy = [orderByName];
        }
        graphql.query({
            query: organisationsSelectQuery,
            variables,
            fetchPolicy: 'no-cache',
        }).then((response) => {
            dispatch({ type: LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID, payload: Immutable(get(response, 'data')) });
        }).catch((error) => {
            dispatch({ type: LOAD_ORGANISATIONS_DROPDOWN_FOR_GRID, payload: error, error: true });
        });
    };
};

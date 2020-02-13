/* @flow */

import history from 'store/History';
import { graphql } from 'graphql/client';
import Immutable from 'app/utils/immutable/Immutable';
import HttpFetch from 'app/utils/http/HttpFetch';
import { loadTableData, loadData, mutateData } from 'app/utils/redux/action-utils';
import { get } from 'app/utils/lo/lo';

import usersQuery from 'graphql/users/usersQuery';
import userByReferenceQuery from 'graphql/app/userByReferenceQuery';
import saveUserMutation from 'graphql/entities/users/saveUserMutation';
import userChangelogQuery from 'graphql/users/userChangelogQuery';

export const LOAD_USER_STARTED: string = '@@affectli/admin/users/LOAD_USER_STARTED';
export const LOAD_USER: string = '@@affectli/admin/users/LOAD_USER';

export const LOAD_USERS_MANAGEMENT_STARTED: string = '@@affectli/admin/users/LOAD_USERS_MANAGEMENT_STARTED';
export const LOAD_USERS_MANAGEMENT: string = '@@affectli/admin/users/LOAD_USERS_MANAGEMENT';

export const LOAD_ROLE_STARTED: string = '@@affectli/admin/users/LOAD_ROLE_STARTED';
export const LOAD_ROLE_OF: string = '@@affectli/admin/users/LOAD_ROLE_OF';

export const CREATE_USER_STARTED: string = '@@affectli/admin/users/CREATE_USER_STARTED';
export const CREATE_USER: string = '@@affectli/admin/users/CREATE_USER';

export const UPDATE_USER_STARTED = '@@affectli/admin/users/UPDATE_USER_STARTED';
export const UPDATE_USER = '@@affectli/admin/users/UPDATE_USER';

export const LOAD_USER_HISTORY_STARTED = '@@affectli/admin/users/LOAD_USER_HISTORY_STARTED';
export const LOAD_USER_HISTORY = '@@affectli/admin/users/LOAD_USER_HISTORY';

/**
 * Loads the users for the DataTable
 *
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 */
export const loadUserManagement = loadTableData(LOAD_USERS_MANAGEMENT_STARTED, LOAD_USERS_MANAGEMENT, usersQuery);

/**
 * Load the detail of the specified User
 *
 * @param user the name of the User to load
 */
export const loadUser = (login: string) => loadData(LOAD_USER_STARTED, LOAD_USER, userByReferenceQuery)({ reference: { login }, id: login });

/**
 * Fetch the user changelog.
 *
 * @param login the entity login.
 * @param id the entity ID.
 * @param options the filter options.
 */
export const loadUserChangelog = (login: string, id: number, options: Object) => (dispatch: Function) => {
    dispatch({ type: LOAD_USER_HISTORY_STARTED });
    return graphql.query({
        query: userChangelogQuery,
        variables: { reference: { login }, id: String(id), ...options },
        fetchPolicy: 'no-cache',
    }).then((response: Object): void => {
        const payload = {
            changes: get(response, 'data.userByReference.changelog'),
            startIndex: options.startIndex,
            count: get(response, 'data.count'),
        };
        dispatch({ type: LOAD_USER_HISTORY, payload });
    }).catch((error) => {
        dispatch({ type: LOAD_USER_HISTORY, payload: error, error: true });
    });
};

/**
 * Load the list of the role
 * @param employee the name of the employee of
 */
export const loadUserRole = (employee: string) => (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_ROLE_STARTED, payload: Immutable({}) });

    return HttpFetch.getResource(`api/rpc?proc_name=org_type_roles&employeeof=${employee}&search_params=`).then((response: Object): Object => {
        dispatch({ type: LOAD_ROLE_OF, payload: { employee, data: (response || {}).data } });
        return response;
    }).catch((error: Error) => {
        dispatch({ type: LOAD_ROLE_OF, payload: error, error: true, });
    });
};

/**
 * Creates a user.
 * @param user the user to create.
 */
export const createUser = (record: Object) => (dispatch: Function, getState: Function) =>
    mutateData(
        CREATE_USER_STARTED,
        CREATE_USER,
        saveUserMutation,
        'User created.',
    )({ record })(dispatch, getState).then((data: Object) => {
        if (data instanceof Error === false) {
            history.push(`/user-management/${data.user_login_id}`);
        }
        return data;
    });

/**
 * Updates a user.
 * @param user the user to edit.
 */
export const updateUser = (record: Object) =>
    mutateData(UPDATE_USER_STARTED, UPDATE_USER, saveUserMutation, 'User updated.')({ record });

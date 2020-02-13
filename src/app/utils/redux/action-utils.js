/* @flow */

import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';


/**
 * Return result or full data
 *
 * @param response data from request.
 */
const _getData = (response: Object) => {
    const data = response.data || {};
    return (data && data.result !== undefined) ? data.result : data;
};

/**
 * Returns the handler function to dipatch a succes after that a GraphQL action completes succesfully.
 *
 * @param dispatch the Redux's dispatch function.
 * @param type the action type to dispatch.
 * @param successMessage the success message to dispatch.
 */
const dispatchSuccess = (dispatch: Function, type: string, successMessage: string) =>
    (response: Object) => {
        const payload = _getData(response);
        dispatch({ type, payload: Immutable(payload), meta: Immutable({ successMessage }), error: false });
        return payload;
    };

/**
 * Returns the handler function to dipatch an error after that a GraphQL action throw an Error.
 *
 * @param dispatch the Redux's dispatch function.
 * @param type the action type to dispatch.
 */
const dispatchError = (dispatch: Function, type: string) =>
    (error: Error) => {
        dispatch({ type, payload: Immutable(error), error: true });
        return Immutable(error);
    };

/**
 * Returns the action to load the data for a DataTable.
 *
 * The returned action will accept only one parameter where the caller can specify the action options: { page, pageSize, countMax, where, orderBy, download }
 *
 * @param startActionType the start action type
 * @param endActionType the end action type
 * @param grqphQlQuery the graphql query.
 *    The query must accept as input variables: page, pageSize, where, orderBy, countMax.
 *    The output of the query must contains 2 properties: records and count.
 *    The records property must contains the list of records to display in the DataTable.
 *    The count property is the total number of records that match the query criterias.
 */
const loadTableData = (startActionType: string, endActionType: string, graphQlQuery: string, countMax: ?number) =>
    (options: Object) => (dispatch: Function, getState: Function): Promise<Object> => {
        const { download, ...variables } = (options || {});
        const meta = Immutable({ download, countMax });
        dispatch({ type: startActionType, meta });
        return graphql.query({
            query: graphQlQuery,
            variables: {
                page: 1,
                pageSize: 10,
                ...variables,
                countMax: countMax || 10000,
                orderBy: (variables.orderBy || []).map(({ field, asc, where }) => ({
                    field,
                    direction: asc ? 'asc' : 'desc',
                    where,
                })),
            },
            fetchPolicy: 'no-cache',
        }).then((response: Object) => {
            const { count, records } = Immutable(get(response, 'data') || {});
            if (!Number.isInteger(count) || !Array.isArray(records)) {
                console.warn(`The action "${endActionType}" is not returning the correct data.`, response); // eslint-disable-line no-console
                throw new Error('The service\'s response is not well formed.');
            }
            dispatch({
                type: endActionType,
                payload: Immutable({ count, records: records.filter(record => record) }),
                meta,
                error: false,
            });
            return { count, records };
        }).catch((error) => {
            dispatch({ type: endActionType, error: true, payload: Immutable(error), meta });
            return error;
        });
    };

/**
 * Returns the action to load the data using a GraphQL query.
 *
 * The returned action will accept only one parameter where the caller can specify the GraphQL query variables.
 *
 * @param startActionType the start action type
 * @param endActionType the end action type
 * @param graphQlQuery  the graphql query. If the output of the query contains the property "result"
 *                      just the value of this property will be returned, otherwise all the data will be returned.
 */
const loadData = (
    startActionType: string,
    endActionType: string,
    graphQlQuery: string,
) =>
    (variables: Object) => (dispatch: Function, getState: Function) => {
        const meta = { ...(variables || {}) };
        dispatch({ type: startActionType, meta });
        return graphql.query({
            query: graphQlQuery,
            variables,
            fetchPolicy: 'no-cache',
        }).then(async (response: Object) => {
            const payload = _getData(response);
            dispatch({ type: endActionType, payload: Immutable(payload), meta, error: false });
            return payload;
        }).catch(dispatchError(dispatch, endActionType));
    };

/**
 * Returns the action to mutate data using GraphQL.
 *
 * @param startActionType the start action type
 * @param endActionType the end action type
 * @param graphQlMutation the graphql mutation.
 * @param successMessage the success message.
 */
const mutateData = (
    startActionType: string,
    endActionType: string,
    graphQlMutation: string,
    successMessage: string,
) =>
    (variables: Object) => (dispatch: Function, getState: Function) => {
        dispatch({ type: startActionType });
        return graphql.mutate({
            mutation: graphQlMutation,
            variables,
        }).then(dispatchSuccess(dispatch, endActionType, successMessage))
            .catch(dispatchError(dispatch, endActionType));
    };

export { loadTableData, loadData, dispatchSuccess, dispatchError, mutateData };

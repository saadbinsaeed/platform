/* @flow */

import HttpFetch from 'app/utils/http/HttpFetch';
import Immutable from 'app/utils/immutable/Immutable';


/**
 * Returns the action to invoke the specified JRP API.
 * The returned function has three parameter:
 * <ul>
 *     <li>queryParams - the params to attach to the query string</li>
 *     <li>queryOptions - the query's options</li>
 *     <li>callback - @deprecated</li>
 * </ul>
 *
 * @param options
 * @returns {function(Object, Object, Function)} the action
 */
const jrpActionFactory: Function = ( options: {
    starterActionType: string,
    actionType: string,
    methodType: string,
    url?: string,
    urlBuilder?: Function,
    metaBuilder?: Function,
    metaStarterBuilder?: Function,
    metaErrorBuilder?: Function,
} ): Function => {

    const {
        starterActionType,
        actionType,
        url,
        urlBuilder,
        metaBuilder,
        metaStarterBuilder,
        metaErrorBuilder
    } = options;

    return (queryParams: Object, queryOptions: Object, callback: Function ): Function => {

        return (dispatch: Function, getState: Function): void => {

            // get or build the url
            let apiUrl = '';
            if (url) {
                apiUrl = url;
            } else if (urlBuilder) {
                apiUrl = urlBuilder(queryParams);
            } else {
                throw new Error('The url and the urlBuilder parameters are not defined: one of the two parameter has to be defined.');
            }

            const metaStarter = metaStarterBuilder
                ? Immutable(metaStarterBuilder(queryParams, queryOptions))
                : undefined;
            dispatch({ type: starterActionType, meta: metaStarter });
            HttpFetch.postResource(apiUrl, queryOptions || {})
                .then( (response: Object): void => {
                    const meta = metaBuilder ? Immutable(metaBuilder(response, queryParams, queryOptions)) : {
                        size: response.recordcount,
                        page: response.page_num,
                        recordsPerPage: response.records_per_page,
                    };
                    dispatch({ type: actionType, payload: Immutable(response.data), meta });
                    if ( callback ) callback( response );
                } )
                .catch( (error: Error): void => {
                    const meta = metaErrorBuilder
                        ? Immutable(metaErrorBuilder(error, queryParams, queryOptions))
                        : undefined;
                    dispatch({ type: actionType, payload: error, error: true, meta });
                    if ( callback ) callback( error );
                } );
        };

    };

};

export { jrpActionFactory };

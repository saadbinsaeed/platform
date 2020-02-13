/* @flow */

import HttpFetch from 'app/utils/http/HttpFetch';
import Immutable from 'app/utils/immutable/Immutable';
import { loadData } from 'app/utils/redux/action-utils';
import customEntityAutocompleteQuery from 'graphql/entities/customEntities/customEntityAutocompleteQuery';

export const LOAD_DIRECTORIES_STARTED: string = '@@affectli/entities/things/LOAD_DIRECTORIES_STARTED';
export const LOAD_DIRECTORIES: string = '@@affectli/entities/things/LOAD_DIRECTORIES';
export const LOAD_DIRECTORIES_AUTOCOMPLETE_STARTED: string = '@@affectli/entities/things/LOAD_DIRECTORIES_AUTOCOMPLETE_STARTED';
export const LOAD_DIRECTORIES_AUTOCOMPLETE: string = '@@affectli/entities/things/LOAD_DIRECTORIES_AUTOCOMPLETE';

/**
 * Loads the directories.
 *
 * @param queryParams the params to attach to the query string
 * @param queryOptions the query's options
 * @param callback
 */
export const loadDirectories = (type: string = 'country') =>  (dispatch: Function) => {
    dispatch({ type: LOAD_DIRECTORIES_STARTED });

    const fields = [{ field: 'domain' }, { field: 'label' }, { field: 'id' }];
    const where = [{ field: 'domain', op: 'contains', value: type }];

    HttpFetch.postResource('api/jrp/directory', {
        fields,
        where,
        kendo: false,
        continuousScrolling: false,
    }).then((data) => {
        dispatch({ type: LOAD_DIRECTORIES, payload: Immutable(data.data), meta: {  directoryType: type } });
    }).catch((error) => {
        dispatch({ type: LOAD_DIRECTORIES, payload: error, error: true });
    });
};

export const loadDirectoriesAutocomplete = loadData(LOAD_DIRECTORIES_AUTOCOMPLETE_STARTED, LOAD_DIRECTORIES_AUTOCOMPLETE, customEntityAutocompleteQuery);

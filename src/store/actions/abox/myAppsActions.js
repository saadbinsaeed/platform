// @flow
import { get } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';

import processesDefinitionsTypeaheadQuery from 'graphql/abox/processesDefinitionsTypeaheadQuery';
import processesDefinitionsQuery from 'graphql/abox/processesDefinitionsQuery';
import processDefinitionQuery from 'graphql/abox/processDefinitionQuery';
import { _fetchPreferences, _savePreferences } from 'store/actions/admin/usersActions';
import Immutable, { set } from 'app/utils/immutable/Immutable';
import { stringify } from 'app/utils/utils';
import { loadData } from 'app/utils/redux/action-utils';
import OptionsBuilder from 'app/utils/api/OptionsBuilder';


export const LOAD_APPS_STARTED: string = '@@affectli/abox/myapps/LOAD_APPS_STARTED';
export const LOAD_APPS: string = '@@affectli/abox/myapps/LOAD_APPS';

export const LOAD_APPS_FAVORITES_STARTED: string = '@@affectli/abox/myapps/LOAD_APPS_FAVORITES_STARTED';
export const LOAD_APPS_FAVORITES: string = '@@affectli/abox/myapps/LOAD_APPS_FAVORITES';

export const SAVE_APPS_FAVORITES_STARTED: string = '@@affectli/abox/myapps/SAVE_APPS_FAVORITES_STARTED';
export const SAVE_APPS_FAVORITES: string = '@@affectli/abox/myapps/SAVE_APPS_FAVORITES';

export const LOAD_ABOX_PROCESS_DEFINITION_STARTED: string = '@@affectli/abox/myapps/LOAD_ABOX_PROCESS_DEFINITION_STARTED';
export const LOAD_ABOX_PROCESS_DEFINITION: string = '@@affectli/abox/myapps/LOAD_ABOX_PROCESS_DEFINITION';

export const LOAD_TYPEAHEAD_PROCESS_DEFINITIONS_STARTED: string = '@@affectli/abox/myapps/LOAD_TYPEAHEAD_PROCESS_DEFINITIONS_STARTED';
export const LOAD_TYPEAHEAD_PROCESS_DEFINITIONS: string = '@@affectli/abox/myapps/LOAD_TYPEAHEAD_PROCESS_DEFINITIONS';


/**
 * Load the Abox App List
 */
export const loadAboxMyApps = () => (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_APPS_STARTED });
    graphql.query({
        query: processesDefinitionsQuery,
        fetchPolicy: 'no-cache'
    }).then((response: Object): void => {
        const processesDefinitions = get(response, 'data.records') || [];
        const apps = {};
        processesDefinitions.forEach((def) => {
            let appId = get(def, 'application.id');
            if (!appId) {
                return;
            }
            const { application, ...processDefinition } = def;
            appId = stringify(appId) || '';
            if (!apps[appId]) {
                apps[appId] = { ...application, processesDefinitions: [] };
            }
            apps[appId].processesDefinitions.push(processDefinition);
        });

        dispatch({ type: LOAD_APPS, payload: Object.values(apps) });
    }).catch((error) => {
        dispatch({ type: LOAD_APPS, payload: error, error: true });
    });
};

export const loadTypeaheadProcessDefinitions =
    () => loadData(LOAD_TYPEAHEAD_PROCESS_DEFINITIONS_STARTED, LOAD_TYPEAHEAD_PROCESS_DEFINITIONS, processesDefinitionsTypeaheadQuery)({});

/**
 * Load the Abox App List
 */
export const saveAboxMyAppsFavorites = (path: string, id: string, name: string, isApp: boolean = false) => async (dispatch: Function, getState: Function) => {
    dispatch({ type: SAVE_APPS_FAVORITES_STARTED });
    try {
        const fullPath = `myApp.${path}`;
        let preferences = await _fetchPreferences();
        const favorites = new Set(get(preferences, fullPath) || []);
        let msg;
        if (favorites.has(id)) {
            msg = 'removed from';
            favorites.delete(id);
        } else {
            msg = 'added to';
            favorites.add(id);
        }

        preferences = set(preferences, fullPath, Array.from(favorites));
        await _savePreferences(preferences);
        dispatch({
            type: SAVE_APPS_FAVORITES,
            payload: Immutable(preferences),
            meta: Immutable({ successMessage: `${isApp ? 'App' : 'Process'} ${name} was ${msg} favorites.` }),
        });
    } catch (error) {
        dispatch({
            type: SAVE_APPS_FAVORITES,
            error: true,
            payload: Immutable(error),
            meta: Immutable({ errorMessage: 'An error occurred saving to favorites.' }),
        });
    }
};



/**
  * Load the user preferences
  */
export const loadAboxMyAppsFavorites = () => (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_APPS_FAVORITES_STARTED });
    _fetchPreferences().then((data) => {
        dispatch({ type: LOAD_APPS_FAVORITES, payload: Immutable(data) });
    }).catch((error) => {
        dispatch({ type: LOAD_APPS_FAVORITES, error: true, payload: Immutable(error) });
    });
};

/**
 * Load the Abox App List
 */
export const loadProcessDefinition = (appId: number, definitionKey: string) => {
    const options = new OptionsBuilder()
        .filter({ field: 'key', op: '=', value: definitionKey })
        .filter({ field: 'application.id', op: '=', value: appId  })
        .build();
    return loadData(LOAD_ABOX_PROCESS_DEFINITION_STARTED, LOAD_ABOX_PROCESS_DEFINITION, processDefinitionQuery)(options);
};

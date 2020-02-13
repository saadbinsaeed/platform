/* @flow */

import gql from 'graphql-tag';

import HttpFetch from 'app/utils/http/HttpFetch';
import Immutable, { set } from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import { loadData } from 'app/utils/redux/action-utils';
import { graphql } from 'graphql/client';
import profileQuery from 'graphql/users/profileQuery';
import preferencesQuery from 'graphql/users/preferencesQuery';
import profileMutation from 'graphql/users/profileMutation';
import userAutocompleteQuery from 'graphql/users/userAutocompleteQuery';
import userSelectQuery from 'graphql/users/userSelectQuery';


export const LOAD_USER_PREFERENCES_STARTED = '@@affectli/users/LOAD_USER_PREFERENCES_STARTED';
export const LOAD_USER_PREFERENCES = '@@affectli/users/LOAD_USER_PREFERENCES';

export const SAVE_USER_PREFERENCES_STARTED = '@@affectli/users/SAVE_USER_PREFERENCES_STARTED';
export const SAVE_USER_PREFERENCES = '@@affectli/users/SAVE_USER_PREFERENCES';

export const RESET_DATA_TABLE_PREFERENCES_STARTED = '@@affectli/users/RESET_DATA_TABLE_PREFERENCES_STARTED';
export const RESET_DATA_TABLE_PREFERENCES = '@@affectli/users/RESET_DATA_TABLE_PREFERENCES';

export const SAVE_DATA_TABLE_PREFERENCES_STARTED = '@@affectli/users/SAVE_DATA_TABLE_PREFERENCES_STARTED';
export const SAVE_DATA_TABLE_PREFERENCES = '@@affectli/users/SAVE_DATA_TABLE_PREFERENCES';

export const LOAD_USER_PROFILE_STARTED = '@@affectli/users/LOAD_USER_PROFILE_STARTED';
export const LOAD_USER_PROFILE = '@@affectli/users/LOAD_USER_PROFILE';

export const UPLOAD_PROFILE_IMAGE_STARTED = '@@affectli/users/UPLOAD_PROFILE_IMAGE_STARTED';
export const UPLOAD_PROFILE_IMAGE = '@@affectli/users/UPLOAD_PROFILE_IMAGE';

export const LOAD_USER_AUTOCOMPLETE_STARTED = '@@affectli/users/LOAD_USER_AUTOCOMPLETE_STARTED';
export const LOAD_USER_AUTOCOMPLETE = '@@affectli/users/LOAD_USER_AUTOCOMPLETE';

export const LOAD_USER_SELECT_STARTED = '@@affectli/users/LOAD_USER_SELECT_STARTED';
export const LOAD_USER_SELECT = '@@affectli/users/LOAD_USER_SELECT';

/**
 * Loads the suggestions for the user autocomplete component.
 */
export const loadUserAutocomplete = loadData(LOAD_USER_AUTOCOMPLETE_STARTED, LOAD_USER_AUTOCOMPLETE, userAutocompleteQuery);

/**
 * Loads the suggestions for the user select component.
 */
export const loadUserSelect = loadData(LOAD_USER_SELECT_STARTED, LOAD_USER_SELECT, userSelectQuery);


/**
 * Load the user profile
 */
export const loadUserProfile = () => (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_USER_PROFILE_STARTED });
    graphql.query({
        query: profileQuery,
        fetchPolicy: 'no-cache'
    }).then( (response: Object) => {
        dispatch({ type: LOAD_USER_PROFILE, payload: Immutable(get(response, 'data.user')) });
    }).catch((error) => {
        dispatch({ type: LOAD_USER_PROFILE, payload: error, error: true });
    });
};


export const _fetchPreferences = () => {
    return graphql.query({
        query: preferencesQuery,
        fetchPolicy: 'no-cache'
    }).then(data => get(data, 'data.preferences.preferences') || {});
};

export const _savePreferences = (preferences: Object) => {
    return graphql.mutate({
        mutation: gql`mutation savePreferences($preferences: JSON) {
          savePreferences(preferences: $preferences)
        }`,
        variables: { preferences }
    });
};


/**
 * Load the user preferences
 */
export const loadUserPreferences = () => (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_USER_PREFERENCES_STARTED });
    _fetchPreferences().then((data) => {
        dispatch({ type: LOAD_USER_PREFERENCES, payload: Immutable(data) });
    }).catch((error) => {
        dispatch({ type: LOAD_USER_PREFERENCES, error: true, payload: Immutable(error) });
    });
};


/**
 * Saves the user preferences
 */
export const saveUserPreferences = (preferences: Object) => (dispatch: Function, getState: Function) => {
    dispatch({ type: SAVE_USER_PREFERENCES_STARTED });
    _savePreferences(preferences).then((data) => {
        dispatch({
            type: SAVE_USER_PREFERENCES,
            payload: Immutable(preferences),
            meta: Immutable({ successMessage: 'User\'s preferences correctly saved.' }),
        });
    }).catch((error) => {
        dispatch({
            type: SAVE_USER_PREFERENCES,
            error: true,
            payload: error,
            meta: Immutable({ errorMessage: 'An error occured saving the user\'s preferences.' }),
        });
    });
};

/**
 * Saves the data table status in the user preferences.
 *
 * @param dataTableId the data table's ID.
 * @param status the data table's status.
 */
export const saveDataTablePreferences = (dataTableId: string, status: Object) => async (dispatch: Function, getState: Function) => {
    dispatch({ type: SAVE_DATA_TABLE_PREFERENCES_STARTED });
    try {
        let preferences = await _fetchPreferences();
        preferences = set(preferences, `dataTable.${dataTableId}`, status);
        await _savePreferences(preferences);
        dispatch({
            type: SAVE_DATA_TABLE_PREFERENCES,
            payload: Immutable(preferences),
            meta: Immutable({ successMessage: 'Data table preferences correctly saved.' }),
        });
    } catch (error) {
        dispatch({
            type: SAVE_DATA_TABLE_PREFERENCES,
            error: true,
            payload: Immutable(error),
            meta: Immutable({ errorMessage: 'An error occured saving the data table preferences.' }),
        });
    }
};

/**
 * Reset the data table status in the user preferences.
 *
 * @param dataTableId the data table's ID.
 */
export const resetDataTablePreferences = (dataTableId: string) => async (dispatch: Function, getState: Function) => {
    dispatch({ type: RESET_DATA_TABLE_PREFERENCES_STARTED });
    try {
        let preferences = await _fetchPreferences();
        preferences = set(preferences, `dataTable.${dataTableId}`, null);
        await _savePreferences(preferences);
        dispatch({
            type: RESET_DATA_TABLE_PREFERENCES,
            payload: Immutable(preferences),
            meta: Immutable({ successMessage: 'Data table preferences successfully restored' }),
        });
    } catch (error) {
        dispatch({
            type: RESET_DATA_TABLE_PREFERENCES,
            error: true,
            payload: Immutable(error),
            meta: Immutable({ errorMessage: 'An error occured restoring the data table preferences.' }),
        });
    }
};

/**
 * Upload the user's profile image.
 *
 * @param image - the image to attach (required)
 */
export const uploadProfileImage = (image: File) => (dispatch: Function, getState: Function): Promise<Object> => {
    dispatch({ type: UPLOAD_PROFILE_IMAGE_STARTED });
    let id = '';
    try {
        if (!image) {
            throw new Error('The image parameter is required');
        }
        const state = getState();
        id = state.user.profile.id;
        if (!id) {
            throw new Error('The profile.id is required!');
        }

        // if the file is not an image return an error
        if ( image.type.indexOf('image/') !== 0 ) {
            const error = new Error(`The file "${image.name}" is not an image.`);
            return Promise.reject(error);
        }
    } catch (error) {
        dispatch({ type: UPLOAD_PROFILE_IMAGE, payload: Immutable(error), error: true, meta: Immutable({ errorMessage: error.message }) });
        return Promise.reject(error);
    }

    const info = { id, image: '' };
    return HttpFetch.uploadFile(`api/rsc/profile_image_${id}`, image, 'image')
        .then((response: Object): Promise<Object> => {
            info.image = response.image;
            return graphql.mutate({ mutation: profileMutation, variables: { profile: { image: response.image } } });
        }).then((response: Object) => {
            dispatch({ type: UPLOAD_PROFILE_IMAGE, payload: Immutable(info), meta: Immutable({ successMessage: 'Profile image uploaded.' }) });
            return info;
        }).catch((error) => {
            dispatch({ type: UPLOAD_PROFILE_IMAGE, payload: error, error: true, meta: Immutable({ errorMessage: 'Profile image upload failed.' }) });
            return error;
        });
};

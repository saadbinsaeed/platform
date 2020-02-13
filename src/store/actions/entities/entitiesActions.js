/* @flow */

import HttpFetch from 'app/utils/http/HttpFetch';
import Immutable from 'app/utils/immutable/Immutable';
import { dispatchSuccess, dispatchError } from 'app/utils/redux/action-utils';
import { loadData } from 'app/utils/redux/action-utils';
import { get } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';
import entityClassesQuery from 'graphql/entities/entities/entityClassesQuery';
import entityChangelogQuery from 'graphql/entities/entities/entityChangelogQuery';
import saveEntityMutation from 'graphql/entities/entities/saveEntityMutation';
import getEntityTypeQuery from 'graphql/entities/common/getEntityTypeQuery';


export const UPLOAD_IMAGE_STARTED = '@@affectli/entities/UPLOAD_IMAGE_STARTED';
export const UPLOAD_IMAGE = '@@affectli/entities/UPLOAD_IMAGE';

export const LOAD_ENTITY_ACTIVITIES_STARTED = '@@affectli/entities/LOAD_ENTITY_ACTIVITIES_STARTED';
export const LOAD_ENTITY_ACTIVITIES = '@@affectli/entities/LOAD_ENTITY_ACTIVITIES';

export const ADD_ENTITY_CLASS_STARTED = '@@affectli/entities/ADD_ENTITY_CLASS_STARTED';
export const ADD_ENTITY_CLASS = '@@affectli/entities/ADD_ENTITY_CLASS';

export const REMOVE_ENTITY_CLASS_STARTED = '@@affectli/entities/REMOVE_ENTITY_CLASS_STARTED';
export const REMOVE_ENTITY_CLASS = '@@affectli/entities/REMOVE_ENTITY_CLASS';

export const LOAD_ENTITY_CHANGELOG_STARTED = '@@affectli/entities/LOAD_ENTITY_CHANGELOG_STARTED';
export const LOAD_ENTITY_CHANGELOG = '@@affectli/entities/LOAD_ENTITY_CHANGELOG';

export const GET_ENTITY_TYPE_STARTED = '@@affectli/entities/GET_ENTITY_TYPE_STARTED';
export const GET_ENTITY_TYPE = '@@affectli/entities/GET_ENTITY_TYPE';


/**
 * Save the specified entity.
 *
 * @param entityId the Entity ID.
 */
const _saveEntity = (record: Object) => graphql.mutate({ mutation: saveEntityMutation, variables: { record } });

/**
 * Returns the classes of the specified entity.
 *
 * @param entityId the Entity ID.
 */
const _getEntityClasses = (entityId: number) => graphql.query({ query: entityClassesQuery, variables: { id: entityId }, fetchPolicy: 'no-cache' });

/**
 * Add the given class to the specified entity
 *
 * @param entityId the Entity ID.
 * @param classUri the Class URI.
 */
export const addEntityClasses = (entityId: number, classUri: Array<string>) => async(dispatch: Function) => {
    dispatch({ type: ADD_ENTITY_CLASS_STARTED });
    const prefix = classUri.length === 1 ? 'Classification' : 'Classifications';
    return _getEntityClasses(entityId).then((response) => {
        return (get(response, 'data.entity.classes') || []).map(({ uri }) => uri);
    }).then(( uris ) => {
        // merge the actual classes and the new ones (removing duplicates, if any)
        const set = new Set([ ...uris, ...classUri ]);
        if (set.size === new Set(uris).size) {
            throw new Error(`${prefix} already added.`);
        }
        return _saveEntity({ id: entityId, classes: Array.from(set).map(uri => ({ uri })) });
    }).then(
        dispatchSuccess(dispatch, ADD_ENTITY_CLASS, `${prefix} added.`)
    ).catch(dispatchError(dispatch, ADD_ENTITY_CLASS));
};

/**
 * Remove the specified class from the specified entity.
 *
 * @param entityId the Entity ID.
 * @param classUri the Class URI.
 */
export const removeEntityClass = (entityId: number, classUri: string) => ( dispatch: Function) => {
    dispatch({ type: REMOVE_ENTITY_CLASS_STARTED });
    return _getEntityClasses(entityId).then((response) => {
        return (get(response, 'data.entity.classes') || []).map(({ uri }) => uri);
    }).then(( uris ) => {
        const set = new Set(uris);
        const deleted = set.delete(classUri);
        if (!deleted) {
            throw new Error('Classification already removed.');
        }
        return _saveEntity({ id: entityId, classes: Array.from(set).map(uri => ({ uri })) });
    }).then(
        dispatchSuccess(dispatch, REMOVE_ENTITY_CLASS, 'Classification removed.')
    ).catch(dispatchError(dispatch, REMOVE_ENTITY_CLASS));
};

/**
 * Upload the image for the specified Entity.
 *
 * @param entityId - the Entity ID (required)
 * @param entityType - the Entity type (required)
 * @param image - the image to attach (required)
 */
export const uploadImage = (entityId: string, entityType: string, image: File) => (dispatch: Function): Promise<Object> => {
    if (!entityId || !entityType || !image) {
        throw new Error(`Cannot upload the image: a required parameter is missing: id=${entityId}, type=${entityType}, image=${String(image)}`);
    }

    // if the file is not an image return an error
    if ( image.type.indexOf('image/') !== 0 ) {
        dispatch({
            type: UPLOAD_IMAGE,
            payload: new Error('Upload failed: the specified file is not an image.'),
            error: true,
            meta: Immutable({
                errorTitle: 'Upload failed',
                errorMessage: `The file "${image.name}" is not an image.`
            }),
        });
        const error = new Error(`The file "${image.name}" is not an image.`);
        return Promise.reject(error);
    }
    dispatch({ type: UPLOAD_IMAGE_STARTED, meta: Immutable({ entityId, entityType }) });

    const info = { entityId, image: '' };
    return HttpFetch.uploadFile(`api/rsc/${ entityType }_image_${ entityId }`, image, 'image')
        .then((response: Object): Promise<Object> => {
            info.image = response.image;
            return _saveEntity({ id: entityId, image: response.image });
        }).then((response: Object) => {
            dispatch({
                type: UPLOAD_IMAGE,
                payload: Immutable(info),
                meta: Immutable({ entityId, entityType, successMessage: 'Image uploaded.' }),
            });
            return info;
        }).catch((error) => {
            dispatch({ type: UPLOAD_IMAGE, payload: error, error: true, meta: Immutable({ entityId, entityType, errorMessage: 'Image upload failed.' }) });
            return error;
        });
};


/**
 * Fetch the entity changelog.
 *
 * @param id the entity ID.
 */
export const loadEntityChangelog = (id: string, options: Object) => (dispatch: Function) => {
    dispatch({ type: LOAD_ENTITY_CHANGELOG_STARTED });
    return graphql.query({
        query: entityChangelogQuery,
        variables: { id, textId: String(id), ...options },
        fetchPolicy: 'no-cache',
    }).then((response: Object): void => {
        const payload = {
            changes: get(response, 'data.entity.changelog'),
            startIndex: options.startIndex,
            count: get(response, 'data.count'),
        };
        dispatch({ type: LOAD_ENTITY_CHANGELOG, payload });
    }).catch((error) => {
        dispatch({ type: LOAD_ENTITY_CHANGELOG, payload: error, error: true });
    });
};

export const getEntityType = (id: number) => loadData(GET_ENTITY_TYPE_STARTED, GET_ENTITY_TYPE, getEntityTypeQuery)({ id });

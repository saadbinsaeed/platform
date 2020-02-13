/* @flow */
import gql from 'graphql-tag';

import HttpFetch from 'app/utils/http/HttpFetch';
import Immutable from 'app/utils/immutable/Immutable';
import { loadData } from 'app/utils/redux/action-utils';
import { get } from 'app/utils/lo/lo';
import { capitalizeFirstLetter } from 'app/utils/utils';
import { graphql } from 'graphql/client';
import OptionsBuilder from 'app/utils/api/OptionsBuilder';

import attachmentsQueryBuilder from 'graphql/common/attachmentsQueryBuilder';

export const GET_ATTACHMENTS_STARTED: string = '@@affectli/entities/things/attachments/GET_ATTACHMENTS_STARTED';
export const GET_ATTACHMENTS: string = '@@affectli/entities/things/attachments/GET_ATTACHMENTS';
export const ATTACH_FILE_STARTED: string = '@@affectli/entities/things/attachments/ATTACH_FILE_STARTED';
export const ATTACH_FILE: string = '@@affectli/entities/things/attachments/ATTACH_FILE';
export const DELETE_ATTACHMENT_STARTED: string = '@@affectli/entities/things/attachments/DELETE_ATTACHMENT_STARTED';
export const DELETE_ATTACHMENT: string = '@@affectli/entities/things/attachments/DELETE_ATTACHMENT';

/**
 * Loads the attachments related to an entity for the DataTable.
 *
 * @param entityId the entity ID
 * @param entityType the entity type
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download, queryParams: { entityType, entityId } })
 */
export const loadEntityAttachments = (entityId: string, entityType: string, options: Object) => {
    const type = entityType === 'custom' ? 'customEntity' : entityType;
    const countType = `file${capitalizeFirstLetter(type)}`;
    const entity = entityType === 'custom' ? 'fileCustomEntities' : `${countType}s`;
    const filterByEntityId = { field: `${type}.id`, op: '=', value: entityId  };
    const variables = new OptionsBuilder(options)
        .defaultStartStopIndexs(0, 30)
        .filter(filterByEntityId)
        .build();
    return loadData(GET_ATTACHMENTS_STARTED, GET_ATTACHMENTS, attachmentsQueryBuilder({ entity, countType }))({ ...variables });
};

/**
 * Adds the given file to the specified entity as an attachment.
 *
 * @param entityId the Entity ID (required).
 * @param file the attachment (required).
 */
export const attachEntityFile = (entityId: number, file: File) => (dispatch: Function) => {
    dispatch({ type: ATTACH_FILE_STARTED });

    const operations = {
        query: 'mutation ($file: Upload!, $entityId: Int!) { attachToEntity(file: $file, entityId: $entityId) }',
        variables: { file: null, entityId },
    };

    let errorMessage = 'File upload failed.';
    return HttpFetch
        .postForm('graphql', operations, file)
        .then((response: Object) => {
            if (response.errors) {
                throw new Error(get(response, 'errors[0].message') || '');
            }
            dispatch({
                type: ATTACH_FILE,
                payload: Immutable({ entityId, url: response.url }),
                meta: Immutable({ successMessage: `${file.name} attached.` }),
            });
        })
        .catch((error: Object) => {
            if ((error.message || '').includes('exceeds the size limit')) {
                errorMessage = `The size of the file "${file.name}" exceeds the limit allowed and cannot be saved.`;
            }
            dispatch({ type: ATTACH_FILE, payload: Immutable(error), error: true, meta: Immutable({ errorMessage }) });
        });
};

/**
 * Removes the specified attachment from to specified the Entity.
 *
 * @param entityId the Entity ID (required).
 * @param fileName the name of the attachment to delete (required).
 */
export const deleteEntityAttachment= (entityId: number, fileName: string) => (dispatch: Function, getState: Function) => {
    dispatch({ type: DELETE_ATTACHMENT_STARTED, meta: Immutable({ entityId, fileName }) });
    return graphql.mutate({
        mutation: gql`mutation ($fileName: String!, $entityId: Int!) { deleteEntityAttachment(fileName: $fileName, entityId: $entityId) }`,
        variables: { entityId, fileName }
    }).then((response: Object): void => {
        dispatch({
            type: DELETE_ATTACHMENT,
            payload: null,
            meta: Immutable( { entityId, fileName, successMessage: `${fileName} successfully removed.` } ),
        });
    }).catch((error) => {
        dispatch({ type: DELETE_ATTACHMENT, payload: Immutable(error), error: true, meta: Immutable({ entityId, fileName }) });
    });
};

// @flow
import Immutable from 'app/utils/immutable/Immutable';

import { loadData } from 'app/utils/redux/action-utils';
import OptionsBuilder from 'app/utils/api/OptionsBuilder';
import { get } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';

import aboxAttachmentsQuery from 'graphql/abox/aboxAttachmentsQuery';
import deleteAttachmentMutation from 'graphql/abox/deleteAttachmentMutation';

export const LOAD_ABOX_ATTACHMENTS_STARTED = '@@affectli/abox/LOAD_ABOX_ATTACHMENTS_STARTED';
export const LOAD_ABOX_ATTACHMENTS = '@@affectli/abox/LOAD_ABOX_ATTACHMENTS';

export const OUTDATE_ABOX_ATTACHMENTS = '@@affectli/abox/OUTDATE_ABOX_ATTACHMENTS';

export const DELETE_ABOX_ATTACHMENTS_STARTED: string = '@@affectli/abox/DELETE_ABOX_ATTACHMENTS_STARTED';
export const DELETE_ABOX_ATTACHMENTS: string = '@@affectli/abox/DELETE_ABOX_ATTACHMENTS';

export const UPLOAD_ABOX_ATTACHMENTS_STARTED = '@@affectli/abox/UPLOAD_ABOX_ATTACHMENTS_STARTED';
export const UPLOAD_ABOX_ATTACHMENTS = '@@affectli/abox/UPLOAD_ABOX_ATTACHMENTS';

export const GET_ABOX_RELATIONSHIPS_STARTED = '@@affectli/abox/GET_ABOX_RELATIONSHIPS_STARTED';
export const GET_ABOX_RELATIONSHIPS = '@@affectli/abox/GET_ABOX_RELATIONSHIPS';

export const SET_TIMELINE_ZOOM = '@@affectli/abox/SET_TIMELINE_ZOOM';

/**
 * Sets the Abox Attachments as outdated.
 */
export const outdateAboxAttachments = (id: number, type: string, outdate: ?boolean = true) => (dispatch: Function, getState: Function) => {
    const state = getState();
    if (type === 'task' && id === get(state, 'abox.task.details.data.id')) {
        dispatch({ type: OUTDATE_ABOX_ATTACHMENTS, payload: outdate });
    } else if (type === 'process' && id === get(state, 'abox.process.details.data.id')) {
        dispatch({ type: OUTDATE_ABOX_ATTACHMENTS, payload: outdate });
    }
};

/**
 * Load Abox Attachments
 */
export const loadAboxAttachments = (id: number, type: string, options: Object = {}) => (dispatch: Function, getState: Function) => {
    const variables = new OptionsBuilder(options)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: `${type}.id`, op: '=', value: String(id) })
        .build();
    return loadData(LOAD_ABOX_ATTACHMENTS_STARTED, LOAD_ABOX_ATTACHMENTS, aboxAttachmentsQuery)(variables)(dispatch, getState)
        .then(() => outdateAboxAttachments(id, type, false)(dispatch, getState));
};

/**
 * Delete Abox Attachments
 */
export const deleteAboxAttachment = (attachmentId: number) => (dispatch: Function) => {
    dispatch({ type: DELETE_ABOX_ATTACHMENTS_STARTED });

    return graphql.mutate({
        mutation: deleteAttachmentMutation,
        variables: { attachmentId },
        fetchPolicy: 'no-cache',
    }).then((response: Object): void => {
        dispatch({
            type: DELETE_ABOX_ATTACHMENTS,
            payload: response,
            meta: Immutable({ successMessage: `Attachment ${attachmentId} has been deleted.` })
        });
    }).catch((error) => {
        dispatch({ type: DELETE_ABOX_ATTACHMENTS, payload: error, error: true });
    });
};

/**
 * Upload Abox Attachment
 */
export const uploadAboxAttachment = (id: string, type: string, file: File) => (dispatch: Function) => {
    dispatch({ type: UPLOAD_ABOX_ATTACHMENTS_STARTED });
    let query = null;
    let variables = null;
    if (type === 'process') {
        query = 'mutation ($file: Upload!, $processId: String!) { attachToProcess(file: $file, processId: $processId) }';
        variables = { file: null, processId: String(id) };
    } else {
        query = 'mutation ($file: Upload!, $taskId: String!) { attachToTask(file: $file, taskId: $taskId) }';
        variables = { file: null, taskId: id };
    }
    return graphql.upload({ query, variables, file })
        .then((resp: Object): void => {
            const meta = Immutable({ successMessage: `Attachment has been uploaded successfully.` });
            dispatch({ type: UPLOAD_ABOX_ATTACHMENTS, payload: resp, meta });
        })
        .catch((error: Error): void => {
            dispatch({ type: UPLOAD_ABOX_ATTACHMENTS, payload: error, error: true });
        });
};

/**
 * Set Timeline Range
 */
export const setTimelineRange = (range: string) => (dispatch: Function) => {
    dispatch({ type: SET_TIMELINE_ZOOM, payload: range });
};
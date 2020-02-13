// @flow
import { graphql } from 'graphql/client';
// Queries
import Immutable from 'app/utils/immutable/Immutable';
import processMessageQuery from 'graphql/messenger/processMessageQuery';
import taskMessageQuery from 'graphql/messenger/taskMessageQuery';
import addProcessCommentMutation from 'graphql/messenger/addProcessCommentMutation';
import addTaskCommentMutation from 'graphql/messenger/addTaskCommentMutation';
import { loadData } from 'app/utils/redux/action-utils';
import { get } from 'app/utils/lo/lo';

export const TOGGLE_MESSENGER = '@@affectli/messenger/TOGGLE_MESSENGER';
export const LOAD_MESSENGER_STARTED = '@@affectli/messenger/LOAD_MESSENGER';
export const LOAD_MESSENGER = '@@affectli/messenger/SET_MESSENGER_SELECTION';

export const LOAD_MESSENGER_PROCESS_MESSAGES_STARTED = '@@affectli/messenger/LOAD_MESSENGER_PROCESS_MESSAGES_STARTED';
export const LOAD_MESSENGER_PROCESS_MESSAGES = '@@affectli/messenger/LOAD_MESSENGER_PROCESS_MESSAGES';

export const LOAD_MESSENGER_TASK_MESSAGES_STARTED = '@@affectli/messenger/LOAD_MESSENGER_TASK_MESSAGES_STARTED';
export const LOAD_MESSENGER_TASK_MESSAGES = '@@affectli/messenger/LOAD_MESSENGER_TASK_MESSAGES';

export const ADD_PROCESS_COMMENT_STARTED = '@@affectli/messenger/ADD_PROCESS_COMMENT_STARTED';
export const ADD_PROCESS_COMMENT = '@@affectli/messenger/ADD_PROCESS_COMMENT';

export const ADD_TASK_COMMENT_STARTED = '@@affectli/messenger/ADD_TASK_COMMENT_STARTED';
export const ADD_TASK_COMMENT = '@@affectli/messenger/ADD_TASK_COMMENT';

export const SAVE_MESSAGE_STARTED = '@@affectli/messenger/SAVE_MESSAGE_STARTED';
export const SAVE_MESSAGE = '@@affectli/messenger/SAVE_MESSAGE';

export const ATTACH_FILE_MESSEGE_STARTED: string = '@@affectli/messenger/ATTACH_FILE_MESSEGE_STARTED';
export const ATTACH_FILE_MESSEGE: string = '@@affectli/messenger/ATTACH_FILE_MESSEGE';


export const toggleMessenger = () => (dispatch: Function) => {
    dispatch({ type: TOGGLE_MESSENGER });
};

export const loadMessenger = (id: string, type: string = 'process') => (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_MESSENGER_STARTED });
    if (id && type === 'process') {
        dispatch({ type: LOAD_MESSENGER, payload: { id, type } });
        return loadProcessMessages(id)(dispatch, getState);
    } else if (id && type === 'task') {
        dispatch({ type: LOAD_MESSENGER, payload: { id, type } });
        return loadTaskMessages(id)(dispatch, getState);
    } else {
        throw new Error(`ID or Type "${type}" is missing or does not exist`);
    }
};

// eslint-disable-next-line max-len
export const saveMessage = (id: string, type: string, message: string, plainMessage: string) => (dispatch: Function, getState: Function) => {
    dispatch({ type: SAVE_MESSAGE_STARTED });
    if (id && type === 'process') {
        dispatch({ type: SAVE_MESSAGE });
        addProcessComment(id, message, plainMessage)(dispatch, getState);
    } else if (id && type === 'task') {
        dispatch({ type: SAVE_MESSAGE });
        addTaskComment(id, message, plainMessage)(dispatch, getState);
    } else {
        throw new Error(`ID or Type "${type}" is missing or does not exist`);
    }
};

/**
 * Load the Abox Process Messages
 */
export const loadProcessMessages = (id: string) => {
    if (!id) {
        throw new Error('The ID is required.');
    }
    return loadData(LOAD_MESSENGER_PROCESS_MESSAGES_STARTED, LOAD_MESSENGER_PROCESS_MESSAGES, processMessageQuery)({ id });
};

/**
 * Load the Abox Task Messages
 */
export const loadTaskMessages = (id: string) => {
    if (!id) {
        throw new Error('The ID is required.');
    }
    return loadData(LOAD_MESSENGER_TASK_MESSAGES_STARTED, LOAD_MESSENGER_TASK_MESSAGES, taskMessageQuery)({ id });
};

export const addProcessComment = (processId: string, message: string, plainMessage: string) => (dispatch: Function, getState: Function) => {
    dispatch({ type: ADD_PROCESS_COMMENT_STARTED });
    return graphql.mutate({
        mutation: addProcessCommentMutation,
        variables: { processId, message, plainMessage },
        fetchPolicy: 'no-cache',
    }).then((response: Object): void => {
        dispatch({
            type: ADD_PROCESS_COMMENT,
            payload: response,
        });
        loadProcessMessages(processId)(dispatch, getState);
    }).catch((error) => {
        dispatch({ type: ADD_PROCESS_COMMENT, payload: error, error: true });
    });
};

/**
 * Send Process Comment
 */
export const addTaskComment = (taskId: string, message: string, plainMessage: string) => (dispatch: Function, getState: Function) => {
    dispatch({ type: ADD_TASK_COMMENT_STARTED });
    return graphql.mutate({
        mutation: addTaskCommentMutation,
        variables: { taskId, message, plainMessage },
        fetchPolicy: 'no-cache',
    }).then((response: Object): void => {
        dispatch({
            type: ADD_TASK_COMMENT,
            payload: response,
        });
        loadTaskMessages(taskId)(dispatch, getState);
    }).catch((error) => {
        dispatch({ type: ADD_TASK_COMMENT, payload: error, error: true });
    });
};


/**
 * Adds the given file to the task/process as an attachment in messenger.
 *
 * @param id the Task/Process ID (required).
 * @param type should be task or process type (required).
 * @param file the attachment (required).
 */
export const attachMessengerFile = (id: number, type: string, file: File) => (dispatch: Function) => {
    dispatch({ type: ATTACH_FILE_MESSEGE_STARTED });

    const mutationName = type === 'task' ? 'addTaskCommentFile' : 'addProcessCommentFile';
    const mutationId = type === 'task' ? 'taskId' : 'processId';
    const query = `mutation ($file: Upload!, $id: String!) { ${mutationName}(file: $file, ${mutationId}: $id) }`;
    const variables = { file: null, id };

    let errorMessage = 'File upload failed.';
    return graphql.upload({ query, variables, file })
        .then((response: Object) => {
            if (response.errors) {
                throw new Error(get(response, 'errors[0].message') || '');
            }
            dispatch({
                type: ATTACH_FILE_MESSEGE,
                payload: Immutable({ id, url: response.url }),
                meta: Immutable({ successMessage: `${file.name} attached.` }),
            });
        })
        .catch((error: Object) => {
            if ((error.message || '').includes('exceeds the size limit')) {
                errorMessage = `The size of the file "${file.name}" exceeds the limit allowed and cannot be saved.`;
            }
            dispatch({ type: ATTACH_FILE_MESSEGE, payload: Immutable(error), error: true, meta: Immutable({ errorMessage }) });
        });
};

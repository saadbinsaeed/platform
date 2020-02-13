/* @flow */
import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import { notifyBroadcasts } from 'app/utils/notification/notify-broadcast';
import { getArray } from 'app/utils/utils';
import { graphql } from 'graphql/client';
import { notify } from 'app/utils/notification/notification';
import { loadData } from 'app/utils/redux/action-utils';

import organisationProfileQuery from 'graphql/app/organisationProfileQuery';
import notificationsQuery from 'graphql/app/notificationsQuery';
export const TOGGLE_NAV = '@@affectli/app/TOGGLE_NAV';
export const OPEN_NAV = '@@affectli/app/OPEN_NAV';
export const TOGGLE_NOTIFICATIONS = '@@affectli/app/TOGGLE_NOTIFICATIONS';
export const TOGGLE_CHAT = '@@affectli/app/TOGGLE_CHAT';
export const TOGGLE_SEARCH = '@@affectli/app/TOGGLE_SEARCH';
export const SELECT_THEME = '@@affectli/app/SELECT_THEME';
export const SET_HEADERS = '@@affectli/app/SET_HEADERS';
export const LOAD_APP_ORGANISATION_STARTED = '@@affectli/app/LOAD_APP_ORGANISATION_IMAGE_STARTED';
export const LOAD_APP_ORGANISATION = '@@affectli/app/LOAD_APP_ORGANISATION_IMAGE';
export const SHOW_TOASTR = '@@affectli/app/SHOW_TOASTR';
export const ERROR_ALERT_MESSAGE = '@@affectli/app/ERROR_ALERT_MESSAGE';
export const LOAD_NOTIFICATIONS_STARTED = '@@affectli/app/LOAD_NOTIFICATIONS_STARTED';
export const LOAD_NOTIFICATIONS = '@@affectli/app/LOAD_NOTIFICATIONS';
export const LOAD_AUTOCOMPLETE_STARTED = '@@affectli/app/LOAD_AUTOCOMPLETE_STARTED';
export const LOAD_AUTOCOMPLETE = '@@affectli/app/LOAD_AUTOCOMPLETE';
export const TOGGLE_APP_HEADERS = '@@affectli/app/TOGGLE_APP_HEADERS';
export const HIDE_STEPPER_SAVE_BUTTON = '@@affectli/app/stepper/HIDE_STEPPER_SAVE_BUTTON';
export const SHOW_STEPPER_SAVE_BUTTON = '@@affectli/app/stepper/SHOW_STEPPER_SAVE_BUTTON';

/**
 * TOGGLE_NAV Action
 */
export function toggleNav() {
    return (dispatch: Function): void => {
        dispatch({ type: TOGGLE_NAV });
    };
}

/**
 * Set NAV to open
 */
export function openNav() {
    return (dispatch: Function): void => {
        dispatch({ type: OPEN_NAV });
    };
}

/**
 * Set CHAT to true or false
 */
export function setChat() {
    return {
        type: TOGGLE_CHAT,
    };
}

/**
 * TOGGLE_CHAT Action
 */
export function toggleChat() {
    return async (dispatch: Function) => {
        dispatch(setChat());
    };
}

/**
 * Set CHAT to true or false
 */
export function setNotifications() {
    return {
        type: TOGGLE_NOTIFICATIONS,
    };
}

/**
 * TOGGLE_CHAT Action
 */
export function toggleNotifications() {
    return async (dispatch: Function) => {
        dispatch(setNotifications());
    };
}

/**
 * Send header object to app headers
 */
export const setHeader = (headers: Object[] = []) => (dispatch: Function): void => {
    dispatch({ type: SET_HEADERS, payload: Immutable(headers) });
};

export const toggleAppHeader = (instruction: Boolean) => (dispatch: Function) => dispatch({ type: TOGGLE_APP_HEADERS, payload: instruction });

export const hideStepperSave = () => (dispatch: Function) => dispatch({ type: HIDE_STEPPER_SAVE_BUTTON });

export const showStepperSave = () => (dispatch: Function) => dispatch({ type: SHOW_STEPPER_SAVE_BUTTON });


export const loadAppOrganisation = () => (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_APP_ORGANISATION_STARTED });
    graphql.query({ query: organisationProfileQuery, fetchPolicy: 'no-cache', })
        .then((response: Object) => {
            dispatch({ type: LOAD_APP_ORGANISATION, payload: Immutable(get(response, 'data.organisationProfile')) });
        })
        .catch((error) => {
            dispatch({ type: LOAD_APP_ORGANISATION, payload: error, error: true });
        });
};

/**
 * Loads the notifications about the tasks and the active broadcasts.
 */
export const loadNotifications = () => (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_NOTIFICATIONS_STARTED });
    const state = getState();
    const { login } = state.user.profile || {};
    graphql.query({ query: notificationsQuery, fetchPolicy: 'no-cache' })
        .then((response: Object) => {

            // show the broadcast notifications
            const broadcasts = getArray(response, 'data.broadcasts') || [];
            notifyBroadcasts(broadcasts);

            // show the task notifications
            const tasks = get(response, 'data.tasks') || [];
            tasks.forEach(({ assignee, owner, description, id, name }) => {
                let title;
                if (login === (assignee || {}).login) {
                    title = 'You have a new task assigned to you.';
                } else if (login === (owner || {}).login) {
                    title = 'You are the owner of a task.';
                } else {
                    title = 'You are a member of a task.';
                }
                notify(title, {
                    tag: `task#${id}`,
                    body: `${name} \n ${description || ''}`,
                    data: { link: `/#/abox/task/${id}` },
                });
            });

            dispatch({ type: LOAD_NOTIFICATIONS, payload: Immutable(response.data) || Immutable([]) });
        })
        .catch((error) => {
            dispatch({ type: LOAD_NOTIFICATIONS, payload: Immutable(error), error: true });
        });
};

export const showToastr = (options: Object) => (dispatch: Function) => {
    dispatch({ type: SHOW_TOASTR, payload: options });
};

export const loadAutocomplete = (query: any, queryOptions: Object) => loadData(LOAD_AUTOCOMPLETE_STARTED, LOAD_AUTOCOMPLETE, query)(queryOptions);

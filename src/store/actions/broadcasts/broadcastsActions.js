/* @flow */
import Immutable from 'app/utils/immutable/Immutable';
import HttpFetch from 'app/utils/http/HttpFetch';
import { loadTableData, loadData, mutateData } from 'app/utils/redux/action-utils';
import { get } from 'app/utils/lo/lo';
import { notifyBroadcasts } from 'app/utils/notification/notify-broadcast';
import { getArray } from 'app/utils/utils';
import OptionsBuilder from 'app/utils/api/OptionsBuilder';
import { graphql } from 'graphql/client';
import activeBroadcastsQuery from 'graphql/broadcast/activeBroadcastsQuery';
import broadcastQuery from 'graphql/broadcast/broadcastQuery';
import broadcastsQuery from 'graphql/broadcast/broadcastsQuery';
import broadcastsCalendarQuery from 'graphql/broadcast/broadcastsCalendarQuery';
import saveBroadcastMutation from 'graphql/broadcast/saveBroadcastMutation';
import readBroadcastMutation from 'graphql/broadcast/readBroadcastMutation';

export const GET_BROADCASTS_STARTED = '@@affectli/broadcasts/GET_BROADCASTS_STARTED';
export const GET_BROADCASTS = '@@affectli/broadcasts/GET_BROADCASTS';

export const GET_BROADCASTS_CALENDAR_STARTED = '@@affectli/broadcasts/GET_BROADCASTS_CALENDAR_STARTED';
export const GET_BROADCASTS_CALENDAR = '@@affectli/broadcasts/GET_BROADCASTS_CALENDAR';

export const GET_BROADCAST_STARTED = '@@affectli/broadcasts/GET_BROADCAST_STARTED';
export const GET_BROADCAST = '@@affectli/broadcasts/GET_BROADCAST';

export const SAVE_BROADCAST = '@@affectli/broadcasts/SAVE_BROADCAST';
export const SAVE_BROADCAST_STARTED = '@@affectli/broadcasts/SAVE_BROADCAST_STARTED';

export const GET_BROADCAST_MEMBERS_STARTED = '@@affectli/broadcasts/GET_BROADCAST_MEMBERS_STARTED';
export const GET_BROADCAST_MEMBERS = '@@affectli/broadcasts/GET_BROADCAST_MEMBERS';

export const EXPAND_BROADCAST_MEMEBERS = '@@affectli/broadcasts/EXPAND_BROADCAST_MEMEBERS';

export const GET_ACTIVE_BROADCASTS_STARTED = '@@affectli/broadcasts/GET_BROADCASTS_NOTIFICATIONS_STARTED';
export const GET_ACTIVE_BROADCASTS = '@@affectli/broadcasts/GET_BROADCASTS_NOTIFICATIONS';

export const MARK_BROADCAST_READ_STARTED = '@@affectli/broadcasts/MARK_BROADCAST_READ_STARTED';
export const MARK_BROADCAST_READ = '@@affectli/broadcasts/MARK_BROADCAST_READ';

export const expandBroadcastMembers = (broadcastId: number, expandedRows: Array<Object>) => (dispatch: Function) => {
    if (!broadcastId) {
        throw new Error('Ths broadcastId is mandatory.');
    }
    dispatch({ type: EXPAND_BROADCAST_MEMEBERS, payload: Immutable({ broadcastId, expandedRows }) });
};

/**
 * Loads the broadcasts for the DataTable
 *
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 */
export const fetchBroadcasts = (options: Object) => {
    const variables = new OptionsBuilder(options, { legacyWhere: true })
        .filter({ field: 'priority', op: '=', value: 'broadcast' })
        .build();
    return  loadTableData(GET_BROADCASTS_STARTED, GET_BROADCASTS, broadcastsQuery)(variables);
};

/**
 * Loads the broadcasts for the Calendar
 *
 * @param options the options ({ where, orderBy })
 */
export const fetchBroadcastsCalendar = loadData(GET_BROADCASTS_CALENDAR_STARTED, GET_BROADCASTS_CALENDAR, broadcastsCalendarQuery);

export const fetchBroadcastMembers =  (broadcastId: number) => (dispatch: Function) => {
    if (!broadcastId) {
        throw new Error('Ths broadcastId is mandatory.');
    }
    dispatch({ type: GET_BROADCAST_MEMBERS_STARTED, meta: { broadcastId } });
    HttpFetch.postResource('api/jrp/broadcasts/members', {
        where: [{ field: 'broadcast_id', op: '=', value: broadcastId }],
        kendo: false
    }).then((response) => {
        dispatch({ type: GET_BROADCAST_MEMBERS, payload: Immutable(response), meta: { broadcastId } });
    }).catch((error) => {
        dispatch({ type: GET_BROADCAST_MEMBERS, payload: error, error: true, meta: { broadcastId } });
    });
};

/**
 * Fetch the specified broadcast.
 */
export const fetchBroadcast = loadData(GET_BROADCAST_STARTED, GET_BROADCAST, broadcastQuery);

/**
 * Saves (creates or updates) the specified broadcast.
 */
export const saveBroadcast = (record: Object) => mutateData(SAVE_BROADCAST_STARTED, SAVE_BROADCAST, saveBroadcastMutation, 'Broadcast correctly saved.')({ record });

export const fetchBroadcastNotifications = () => {
    return (dispatch: Function): void => {
        dispatch({ type: GET_ACTIVE_BROADCASTS_STARTED });
        graphql.query({
            query: activeBroadcastsQuery,
            fetchPolicy: 'no-cache',
        }).then((response: Object): void => {
            // show the broadcast notifications
            const broadcasts = getArray(response, 'data.broadcasts') || [];
            notifyBroadcasts(broadcasts);

            dispatch({ type: GET_ACTIVE_BROADCASTS, payload: Immutable(get(response, 'data')) });
        }).catch((error) => {
            dispatch({ type: GET_ACTIVE_BROADCASTS, payload: error, error: true });
        });
    };
};

/**
 * Fetch Single Broadcast Notification
 */
export const fetchBroadcastNotification = ({ page = 1, pageSize = 10, orderBy, where }: Object = {}) => {
    return (dispatch: Function/*, getState: Function*/): void => {
        dispatch({ type: GET_ACTIVE_BROADCASTS_STARTED });

        HttpFetch.postResource('api/jrp/broadcasts/members', {
            kendo: false,
            orderBy,
            where,
        }).then((data) => {
            dispatch({ type: GET_ACTIVE_BROADCASTS, payload: Immutable(data) });
        }).catch((error) => {
            dispatch({ type: GET_ACTIVE_BROADCASTS, payload: error, error: true });
        });
    };
};

/**
 * Save broadcast notification
 */
export const markBroadcastRead = (id: number) => (dispatch: Function) => {
    dispatch({ type: MARK_BROADCAST_READ_STARTED });
    return graphql.mutate({
        mutation: readBroadcastMutation,
        variables: { id },
        fetchPolicy: 'no-cache',
    }).then((response) => {
        dispatch({
            type: MARK_BROADCAST_READ,
            payload: get(response, 'data.result'),
            meta: Immutable({ successMessage: 'Broadcast marked as read.' })
        });
    }).catch((error) => {
        dispatch({ type: MARK_BROADCAST_READ, payload: error, error: true });
        return error;
    });

};

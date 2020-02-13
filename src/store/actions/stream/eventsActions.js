/* @flow */

import Immutable from 'app/utils/immutable/Immutable';
import HttpFetch from 'app/utils/http/HttpFetch';
import { graphql } from 'graphql/client';
import eventsQuery from 'graphql/stream/event/eventsQuery';
import eventProcessesQuery from 'graphql/stream/event/eventProcessesQuery';
import vtrQuery from 'graphql/stream/event/vtrQuery';
import { loadTableData, loadData } from 'app/utils/redux/action-utils';
import translationRuleQuery from 'graphql/stream/event/translationRuleQuery';

export const EVENT_START_PROCESS_STARTED = '@@affectli/stream/events/EVENT_START_PROCESS_STARTED';
export const EVENT_START_PROCESS = '@@affectli/stream/events/EVENT_START_PROCESS';

export const LOAD_EVENT_PROCESSES_STARTED = '@@affectli/stream/events/processes/LOAD_PROCESSES_STARTED';
export const LOAD_EVENT_PROCESSES = '@@affectli/stream/processes/LOAD_PROCESSES';

export const LOAD_EVENTS_STARTED = '@@affectli/stream/LOAD_EVENTS_STARTED';
export const LOAD_EVENTS = '@@affectli/stream/LOAD_EVENTS';

export const UPDATE_EVENT_STATUS_STARTED = '@@affectli/stream/events/UPDATE_EVENT_STATUS_STARTED';
export const UPDATE_EVENT_STATUS = '@@affectli/stream/events/UPDATE_EVENT_STATUS';

export const LOAD_VTR_STARTED = '@@affectli/stream/events/LOAD_VTR_STARTED';
export const LOAD_VTR = '@@affectli/stream/events/LOAD_VTR';

export const LOAD_TRANSLATION_RULE_STARTED = '@@affectli/stream/events/LOAD_TRANSLATION_RULE_STARTED';
export const LOAD_TRANSLATION_RULE = '@@affectli/stream/translationRule/LOAD_TRANSLATION_RULE';

/**
 * Load the data for the DataTable in the Events Monitor view
 *
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 */
export const loadEvents = loadTableData(LOAD_EVENTS_STARTED, LOAD_EVENTS, eventsQuery, 1000);


/**
 * Events actions
 *
 * @param status the params to attach to the query string
 * @param eventId the query's options
 */
export const updateEventStatus = (status: Object) => (dispatch: Function) => {
    dispatch({ type: UPDATE_EVENT_STATUS_STARTED });

    return HttpFetch.postResource('api/rpc?proc_name=events', status)
        .then( (response): void => {
            const successMessage = `Status changed to ${status.status} of event ${status.eventId}`;
            dispatch({
                type: UPDATE_EVENT_STATUS,
                payload: Immutable(response.data),
                meta: Immutable({ successMessage }) });
        } ).catch( (error: Error): void => {
            dispatch({ type: UPDATE_EVENT_STATUS, payload: Immutable(error), error: true });
        } );
};

/**
 * Events start process
 *
 * @param params the params to attach to the query string
 */
export const eventStartProcess = (message: string, params: Object) => (dispatch: Function) => {
    dispatch({ type: EVENT_START_PROCESS_STARTED });

    return HttpFetch.putResource(`activiti-app/app/rest/message/${message}`, params)
        .then((resp: Object): void => {
            dispatch({
                type: EVENT_START_PROCESS,
                payload: Immutable(resp),
                meta: Immutable({ successMessage: 'Started process' })
            });
        })
        .catch((error: Error): void => {
            dispatch( { type: EVENT_START_PROCESS, payload: Immutable(error), error: true } );
        });
};

/**
 * Load a list of processes
 * @param options { Object } contains information for page, itemsPerPage ...
 */
export const loadEventProcesses = (processesIds: Array<String>) => (dispatch: Function) => {
    dispatch({ type: LOAD_EVENT_PROCESSES_STARTED });
    const variables = {
        where: [{field: 'id', op: 'in', value: processesIds}],
    };
    graphql.query({
        query: eventProcessesQuery,
        variables,
        fetchPolicy: 'no-cache'
    }).then( ( response: Object ): void => {
        dispatch({ type: LOAD_EVENT_PROCESSES, payload: Immutable(response && response.data) });
    }).catch((error) => {
        dispatch({ type: LOAD_EVENT_PROCESSES, payload: error, error: true });
    });
};

export const loadVTR = () => loadData(LOAD_VTR_STARTED, LOAD_VTR, vtrQuery)({
    filterBy: [{ field: 'uri', op: 'in', value: ['UMS/Vendor', 'UMS/Tenant', 'region']}]
});

const loadTranslationRule = key => loadData(LOAD_TRANSLATION_RULE_STARTED, LOAD_TRANSLATION_RULE, translationRuleQuery)({
    filterBy: [
        { field: 'classes.uri', op: '=', value: 'translation_rule' },
        { field: 'active', op: '=', value: true },
    ],
    groupBy: [{ field: `attributes.translation_rule/${key}`, alias: 'translation' }],
    orderBy: [{ field: `attributes.translation_rule/${key}`, direction: 'asc' }],
});

export const loadTranslationRuleDescription = () => loadTranslationRule('description');

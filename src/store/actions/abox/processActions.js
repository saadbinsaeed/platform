// @flow
import Immutable from 'app/utils/immutable/Immutable';
import { get, set } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';
import { loadTableData, loadData } from 'app/utils/redux/action-utils';
import HttpFetch from 'app/utils/http/HttpFetch';
import OptionsBuilder from 'app/utils/api/OptionsBuilder';
import { mutateData } from 'app/utils/redux/action-utils';
import { _fetchPreferences, _savePreferences } from 'store/actions/admin/usersActions';

import processesQuery from 'graphql/abox/process/processesQuery';
import processesCardsQuery from 'graphql/abox/process/processesCardsQuery';
import processChangelogQuery from 'graphql/abox/process/processChangelogQuery';
import processExpandTasksQuery from 'graphql/abox/process/processExpandTasksQuery';
import processDetailsQuery from 'graphql/abox/process/processDetailsQuery';
import processStartedDetailsQuery from 'graphql/abox/process/processStartedDetailsQuery';
import subprocessesQuery from 'graphql/abox/process/subprocessesQuery';
import addTeamMemberToProcessMutation from 'graphql/abox/process/addTeamMemberToProcessMutation';
import removeTeamMemberFromProcessMutation from 'graphql/abox/process/removeTeamMemberFromProcessMutation';

import { LOAD_USER_PREFERENCES } from 'store/actions/admin/usersActions';

export const LOAD_PROCESSES_STARTED = '@@affectli/process/LOAD_PROCESSES_STARTED';
export const LOAD_PROCESSES = '@@affectli/process/LOAD_PROCESSES';

export const LOAD_EXPANDED_PROCESS_STARTED = '@@affectli/process/LOAD_EXPANDED_PROCESS_STARTED';
export const LOAD_EXPANDED_PROCESS = '@@affectli/process/LOAD_EXPANDED_PROCESS';

export const OUTDATE_PROCESS_DETAILS = '@@affectli/process/OUTDATE_PROCESS_DETAILS';

export const LOAD_PROCESS_DETAILS_STARTED = '@@affectli/process/LOAD_PROCESS_DETAILS_STARTED';
export const LOAD_PROCESS_DETAILS = '@@affectli/process/LOAD_PROCESS_DETAILS';

export const LOAD_STARTED_PROCESS_DETAILS_STARTED = '@@affectli/process/LOAD_STARTED_PROCESS_DETAILS_STARTED';
export const LOAD_STARTED_PROCESS_DETAILS = '@@affectli/process/LOAD_STARTED_PROCESS_DETAILS';

export const ADD_TEAM_MEMBER_STARTED = '@@affectli/process/ADD_TEAM_MEMBER_STARTED';
export const ADD_TEAM_MEMBER = '@@affectli/process/ADD_TEAM_MEMBER';

export const REMOVE_TEAM_MEMBER_STARTED = '@@affectli/process/REMOVE_TEAM_MEMBER_STARTED';
export const REMOVE_TEAM_MEMBER = '@@affectli/process/REMOVE_TEAM_MEMBER';

export const CANCEL_PROCESS_STARTED = '@@affectli/process/CANCEL_PROCESS_STARTED';
export const CANCEL_PROCESS = '@@affectli/process/CANCEL_PROCESS';

export const SET_PROCESS_PRIORITY_STARTED = '@@affectli/process/SET_PROCESS_PRIORITY_STARTED';
export const SET_PROCESS_PRIORITY = '@@affectli/process/SET_PROCESS_PRIORITY';

export const LOAD_SUBPROCESSES_STARTED = '@@affectli/process/LOAD_SUBPROCESSES_STARTED';
export const LOAD_SUBPROCESSES = '@@affectli/process/LOAD_SUBPROCESSES';

export const SAVE_PROCESS_PAGE_VIEW_STARTED = '@@affectli/process/SAVE_PROCESS_PAGE_VIEW_STARTED';
export const SAVE_PROCESS_PAGE_VIEW = '@@affectli/process/SAVE_PROCESS_PAGE_VIEW';

export const LOAD_PROCESSES_CARDS_STARTED = '@@affectli/abox/LOAD_PROCESSES_CARDS_STARTED';
export const LOAD_PROCESSES_CARDS = '@@affectli/abox/LOAD_PROCESSES_CARDS';

export const LOAD_PROCESS_CHANGELOG_STARTED = '@@affectli/task/LOAD_TASK_CHANGELOG_STARTED';
export const LOAD_PROCESS_CHANGELOG = '@@affectli/task/LOAD_TASK_CHANGELOG';

/**
 * Fetch the process changelog.
 *
 * @param id the process ID.
 */
export const loadProcessChangelog = (id: string, options: Object) => (dispatch: Function) => {
    dispatch({ type: LOAD_PROCESS_CHANGELOG_STARTED });
    return graphql.query({
        query: processChangelogQuery,
        variables: { id, ...options },
        fetchPolicy: 'no-cache',
    }).then((response: Object): void => {
        const payload = {
            changes: get(response, 'data.process.changelog'),
            startIndex: options.startIndex,
            count: get(response, 'data.count'),
        };
        dispatch({ type: LOAD_PROCESS_CHANGELOG, payload });
    }).catch((error) => {
        dispatch({ type: LOAD_PROCESS_CHANGELOG, payload: error, error: true });
    });
};

/**
 * Load the Abox processes for the DataTable
 *
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 */
export const loadProcesses = loadTableData(LOAD_PROCESSES_STARTED, LOAD_PROCESSES, processesQuery);

/**
 * Load the Abox Card View
 */
export const loadProcessesCards = (options: Object = {}) => {
    const variables = new OptionsBuilder(options)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'endDate', op: 'is null' })
        .build();
    return loadData(LOAD_PROCESSES_CARDS_STARTED, LOAD_PROCESSES_CARDS, processesCardsQuery)({ ...variables, startIndex: options.startIndex });
};

/**
 * Load the Abox Expanded Process List
 */
export const loadExpandedProcess = (processId: string) => (dispatch: Function, getState: Function) => {
    if (!processId) {
        throw new Error('The processId is mandatory.');
    }
    dispatch({ type: LOAD_EXPANDED_PROCESS_STARTED, meta: Immutable({ processId }) });
    graphql.query({
        query: processExpandTasksQuery,
        variables: { filterBy: [{ field: 'process.id', op: '=', value: processId }] },
        fetchPolicy: 'no-cache'
    }).then((response: Object): void => {
        dispatch({ type: LOAD_EXPANDED_PROCESS, payload: Immutable(get(response, 'data.tasks')), meta: Immutable({ processId }) });
    }).catch((error) => {
        dispatch({ type: LOAD_EXPANDED_PROCESS, payload: error, error: true, meta: Immutable({ processId }) });
    });
};


/**
 * Sets the process details as outdated.
 */
export const outdateProcessDetails = (id: string, outdate: ?boolean = true) => (dispatch: Function, getState: Function) => {
    if (id && id === get(getState(), 'abox.process.details.data.id')) {
        dispatch({ type: OUTDATE_PROCESS_DETAILS, payload: outdate });
    }
};

/**
 * Loads the process details.
 */
export const loadProcessDetails = (id: string) => (dispatch: Function, getState: Function) => {
    return loadData(LOAD_PROCESS_DETAILS_STARTED, LOAD_PROCESS_DETAILS, processDetailsQuery)({ id })(dispatch, getState)
        .then(() => outdateProcessDetails(id, false)(dispatch, getState));
};

/**
 * Load the Abox Process Details after process is started
 */
export const loadStartedProcessDetails = (processId: string) => (dispatch: Function, getState: Function): Promise<?Object> => {
    if (!processId) {
        dispatch({ type: LOAD_STARTED_PROCESS_DETAILS_STARTED });
        dispatch({ type: LOAD_STARTED_PROCESS_DETAILS, payload: [] });
        return Promise.resolve(null);
    }
    const queryOptions = { filterBy: [{ field: 'process.id', op: '=', value: processId }] };
    return loadData(LOAD_STARTED_PROCESS_DETAILS_STARTED, LOAD_STARTED_PROCESS_DETAILS, processStartedDetailsQuery)(queryOptions)(dispatch, getState);
};

/**
 * Load the Abox Process Activities List
 */
export const loadSubprocesses = (id: string = '') => {
    const variables = new OptionsBuilder()
        .filter({ field: 'status.initiatedByProcessId', op: '=', value: id })
        .build();
    return loadData(LOAD_SUBPROCESSES_STARTED, LOAD_SUBPROCESSES, subprocessesQuery)(variables);
};

export const addTeamMember = (id: string, family: string, memberId: number) =>
    mutateData(
        ADD_TEAM_MEMBER_STARTED,
        ADD_TEAM_MEMBER,
        addTeamMemberToProcessMutation,
        'Team member successfully added.',
    )({ id, family, memberId });

export const removeTeamMember = (id: string, family: string, memberId: number) =>
    mutateData(
        ADD_TEAM_MEMBER_STARTED,
        ADD_TEAM_MEMBER,
        removeTeamMemberFromProcessMutation,
        'Team member successfully removed.',
    )({ id, family, memberId });

export const cancelProcess = (id: string) => (dispatch: Function, getState: Function) => {
    dispatch({ type: CANCEL_PROCESS_STARTED });
    return HttpFetch.deleteResource(`activiti-app/app/rest/process-instances/${id}`).then((response: Object) => {
        dispatch({
            type: CANCEL_PROCESS,
            payload: response.data,
            meta: Immutable({ successMessage: `Activity ${id} has been cancelled.` })
        });
    }).catch((error: Error) => {
        dispatch({ type: CANCEL_PROCESS, payload: error, error: true });
        return new Error(error);
    });
};

/**
 * Change the priority of the process
 */
export const setProcessPriority = (processId: string, priority: number) => (dispatch: Function, getState: Function) => {
    dispatch({ type: SET_PROCESS_PRIORITY_STARTED, payload: priority });

    const body = { priority };
    HttpFetch.putResource(`activiti-app/app/rest/process-instances/${processId}/update-priority`, body)
        .then((resp: Object): void => {
            // As response of this call is not returning the priority, this is why we are passing the priority parameter
            dispatch({
                type: SET_PROCESS_PRIORITY,
                payload: priority,
                meta: Immutable({ successMessage: `Priority of process ${processId} has been changed to ${priority}.` }),
            });
            // FIXME: do not nest actions
            return loadProcessDetails(processId)(dispatch, getState);
        })
        .then(async (data: Error | any) => {
            if (data instanceof Error) {
                throw data;
            } else {
                return data;
            }
        })
        .catch((error: Error): void => {
            dispatch({ type: SET_PROCESS_PRIORITY, payload: error, error: true, });
        });
};

/**
 * Save process page view
 */
export const saveProcessPageView = (state: Object, id: string) => async (dispatch: Function, getState: Function) => {
    dispatch({ type: SAVE_PROCESS_PAGE_VIEW_STARTED });
    try {
        const oldPreferences = await _fetchPreferences();
        const preferences = set(oldPreferences, `pageView.${id}`, state);
        await _savePreferences(preferences);
        dispatch({
            type: LOAD_USER_PREFERENCES,
            payload: Immutable(preferences),
        });
    } catch (error) {
        dispatch({
            type: SAVE_PROCESS_PAGE_VIEW,
            error: true,
            payload: Immutable(error),
            meta: Immutable({ errorMessage: 'An error occured saving the view preferences.' }),
        });
    }
};

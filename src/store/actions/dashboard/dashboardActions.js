/* @flow */

import moment from 'moment';

import OptionsBuilder from 'app/utils/api/OptionsBuilder';
import { loadData } from 'app/utils/redux/action-utils';
import dashboardTasksQuery from 'graphql/dashboard/dashboardTasksQuery';
import dashboardTasksLinksQuery from 'graphql/dashboard/dashboardTasksLinksQuery';
import dashboardProcessesQuery from 'graphql/dashboard/dashboardProcessesQuery';
import dashboardProcessesLinksQuery from 'graphql/dashboard/dashboardProcessesLinksQuery';

export const LOAD_TASKS_ASSIGNED_STARTED: string = '@@affectli/dashboard/LOAD_TASKS_ASSIGNED_STARTED';
export const LOAD_TASKS_ASSIGNED: string = '@@affectli/dashboard/LOAD_TASKS_ASSIGNED';

export const LOAD_TASKS_OWNED_STARTED: string = '@@affectli/dashboard/LOAD_TASKS_OWNED_STARTED';
export const LOAD_TASKS_OWNED: string = '@@affectli/dashboard/LOAD_TASKS_OWNED';

export const LOAD_TASKS_FOLLOWING_STARTED: string = '@@affectli/dashboard/LOAD_TASKS_FOLLOWING_STARTED';
export const LOAD_TASKS_FOLLOWING: string = '@@affectli/dashboard/LOAD_TASKS_FOLLOWING';

export const LOAD_TASKS_DONE_STARTED: string = '@@affectli/dashboard/LOAD_TASKS_DONE_STARTED';
export const LOAD_TASKS_DONE: string = '@@affectli/dashboard/LOAD_TASKS_DONE';

export const LOAD_PROCESSES_ASSIGNED_STARTED: string = '@@affectli/dashboard/LOAD_PROCESSES_ASSIGNED_STARTED';
export const LOAD_PROCESSES_ASSIGNED: string = '@@affectli/dashboard/LOAD_PROCESSES_ASSIGNED';

export const LOAD_PROCESSES_OWNED_STARTED: string = '@@affectli/dashboard/LOAD_PROCESSES_OWNED_STARTED';
export const LOAD_PROCESSES_OWNED: string = '@@affectli/dashboard/LOAD_PROCESSES_OWNED';

export const LOAD_PROCESSES_FOLLOWING_STARTED: string = '@@affectli/dashboard/LOAD_PROCESSES_FOLLOWING_STARTED';
export const LOAD_PROCESSES_FOLLOWING: string = '@@affectli/dashboard/LOAD_PROCESSES_FOLLOWING';

export const LOAD_PROCESSES_DONE_STARTED: string = '@@affectli/dashboard/LOAD_PROCESSES_DONE_STARTED';
export const LOAD_PROCESSES_DONE: string = '@@affectli/dashboard/LOAD_PROCESSES_DONE';

/**
 * Loads the assigned tasks.
 */
export const loadTasksAssigned = (user: Object, options: Object = {}) => {
    const { linkOnly, ...opts } = options;
    const variables = new OptionsBuilder(opts)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'endDate', op: 'is null' })
        .filter({ field: 'assignee.activitiId', op: '=', value: user.activitiId })
        .defaultOrder({ field: 'startDate', asc: false })
        .build();
    const query = linkOnly ? dashboardTasksLinksQuery : dashboardTasksQuery;
    return loadData(LOAD_TASKS_ASSIGNED_STARTED, LOAD_TASKS_ASSIGNED, query)(variables);
};

/**
 * Loads the owned tasks.
 */
export const loadTasksOwned = (user: Object, options: Object = {}) => {
    const { linkOnly, ...opts } = options;
    const variables = new OptionsBuilder(opts)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'endDate', op: 'is null' })
        .filter({ field: 'owner.activitiId', op: '=', value: user.activitiId })
        .defaultOrder({ field: 'startDate', asc: false })
        .build();
    const query = linkOnly ? dashboardTasksLinksQuery : dashboardTasksQuery;
    return loadData(LOAD_TASKS_OWNED_STARTED, LOAD_TASKS_OWNED, query)(variables);
};

/**
 * Loads the member of tasks.
 */
export const loadTasksMemberOf = (user: Object, options: Object = {}) => {
    const { linkOnly, ...opts } = options;
    const variables = new OptionsBuilder(opts)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'endDate', op: 'is null' })
        .filter({ field: 'assignee.activitiId', op: '<>', value: user.activitiId })
        .filter({ field: 'owner.activitiId', op: '<>', value: user.activitiId })
        .defaultOrder({ field: 'startDate', asc: false })
        .build();
    const query = linkOnly ? dashboardTasksLinksQuery : dashboardTasksQuery;
    return loadData(LOAD_TASKS_FOLLOWING_STARTED, LOAD_TASKS_FOLLOWING, query)(variables);
};

/**
 * Loads the done tasks.
 */
export const loadTasksDone = (options: Object = {}) => {
    const { linkOnly, ...opts } = options;
    const variables = new OptionsBuilder(opts)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'endDate', op: 'is not null' })
        .defaultOrder({ field: 'startDate', asc: false })
        .build();
    const query = linkOnly ? dashboardTasksLinksQuery : dashboardTasksQuery;
    return loadData(LOAD_TASKS_DONE_STARTED, LOAD_TASKS_DONE, query)(variables);
};

/**
 * Loads the assigned processes.
 */
export const loadProcessesAssigned = (user: Object, options: Object = {}) => {
    const { linkOnly, ...opts } = options;
    const variables = new OptionsBuilder(opts)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'endDate', op: 'is null' })
        .filter({ field: 'tasks.assignee.activitiId', op: '=', value: user.activitiId })
        .defaultOrder({ field: 'createDate', asc: false })
        .build();
    const query = linkOnly ? dashboardProcessesLinksQuery : dashboardProcessesQuery;
    return loadData(LOAD_PROCESSES_ASSIGNED_STARTED, LOAD_PROCESSES_ASSIGNED, query)(variables);
};

/**
 * Loads the owned processes.
 */
export const loadProcessesOwned = (user: Object, options: Object = {}) => {
    const { linkOnly, ...opts } = options;
    const variables = new OptionsBuilder(opts)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'endDate', op: 'is null' })
        .filter({ field: 'createdBy.activitiId', op: '=', value: user.activitiId })
        .defaultOrder({ field: 'createDate', asc: false })
        .build();
    const query = linkOnly ? dashboardProcessesLinksQuery : dashboardProcessesQuery;
    return loadData(LOAD_PROCESSES_OWNED_STARTED, LOAD_PROCESSES_OWNED, query)(variables);
};

/**
 * Loads the member of processes.
 */
export const loadProcessesMemberOf = (user: Object, options: Object = {}) => {
    const { linkOnly, ...opts } = options;
    const variables = new OptionsBuilder(opts)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'endDate', op: 'is null' })
        .filter({ field: 'createdBy.activitiId', op: '<>', value: user.activitiId })
        .filter({ field: 'tasks.assignee.activitiId', op: '<>', value: user.activitiId })
        .defaultOrder({ field: 'createDate', asc: false })
        .build();
    const query = linkOnly ? dashboardProcessesLinksQuery : dashboardProcessesQuery;
    return loadData(LOAD_PROCESSES_FOLLOWING_STARTED, LOAD_PROCESSES_FOLLOWING, query)(variables);
};

/**
 * Loads the done processes.
 */
export const loadProcessesDone = (userId: number, options: Object = {}) => {
    const twoMonthsAgo = moment().startOf('day').subtract(2, 'months').toDate();
    const { linkOnly, ...opts } = options;
    const variables = new OptionsBuilder(opts)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'endDate', op: '>', value: twoMonthsAgo })
        .defaultOrder({ field: 'createDate', asc: false })
        .build();
    const query = linkOnly ? dashboardProcessesLinksQuery : dashboardProcessesQuery;
    return loadData(LOAD_PROCESSES_DONE_STARTED, LOAD_PROCESSES_DONE, query)(variables);
};
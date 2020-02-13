// @flow
import OptionsBuilder from 'app/utils/api/OptionsBuilder';
import { loadData, mutateData } from 'app/utils/redux/action-utils';
import Immutable from 'app/utils/immutable/Immutable';
import { graphql } from 'graphql/client';
import { get } from 'app/utils/lo/lo';
import HttpFetch from 'app/utils/http/HttpFetch';
import addTeamMemberToTaskMutation from 'graphql/abox/task/addTeamMemberToTaskMutation';
import closeTaskMutation from 'graphql/abox/task/closeTaskMutation';
import createSubtaskMutation from 'graphql/abox/task/createSubtaskMutation';
import processTasksQuery from 'graphql/abox/task/processTasksQuery';
import removeTeamMemberFromTaskMutation from 'graphql/abox/task/removeTeamMemberFromTaskMutation';
import setTaskAssigneeMutation from 'graphql/abox/task/setTaskAssigneeMutation';
import setTaskOwnerMutation from 'graphql/abox/task/setTaskOwnerMutation';
import subtasksQuery from 'graphql/abox/task/subtasksQuery';
import taskCandidateAutocompleteQuery from 'graphql/abox/task/taskCandidateAutocompleteQuery';
import taskMemberAutocompleteQuery from 'graphql/abox/task/taskMemberAutocompleteQuery';
import taskChangelogQuery from 'graphql/abox/task/taskChangelogQuery';
import taskQuery from 'graphql/abox/task/taskQuery';
import tasksCalendarQuery from 'graphql/abox/task/tasksCalendarQuery';
import tasksTimelineQuery from 'graphql/abox/task/tasksTimelineQuery';
import tasksQuery from 'graphql/abox/task/tasksQuery';
import updateTaskMutation from 'graphql/abox/task/updateTaskMutation';

export const LOAD_TASK_CANDIDATE_AUTOCOMPLETE_STARTED = '@@affectli/task/LOAD_TASK_CANDIDATE_AUTOCOMPLETE_STARTED';
export const LOAD_TASK_CANDIDATE_AUTOCOMPLETE = '@@affectli/task/LOAD_TASK_CANDIDATE_AUTOCOMPLETE';

export const LOAD_TASK_MEMBER_AUTOCOMPLETE_STARTED = '@@affectli/task/LOAD_TASK_MEMBER_AUTOCOMPLETE_STARTED';
export const LOAD_TASK_MEMBER_AUTOCOMPLETE = '@@affectli/task/LOAD_TASK_MEMBER_AUTOCOMPLETE';

export const LOAD_TASKS_STARTED = '@@affectli/task/LOAD_TASKS_STARTED';
export const LOAD_TASKS = '@@affectli/task/LOAD_TASKS';

export const LOAD_CALENDAR_TASKS_STARTED = '@@affectli/task/LOAD_CALENDAR_TASKS_STARTED';
export const LOAD_CALENDAR_TASKS = '@@affectli/task/LOAD_CALENDAR_TASKS';

export const LOAD_TIMELINE_TASKS_STARTED = '@@affectli/task/LOAD_TIMELINE_TASKS_STARTED';
export const LOAD_TIMELINE_TASKS = '@@affectli/task/LOAD_TIMELINE_TASKS';

export const CLOSE_TASK_STARTED = '@@affectli/task/CLOSE_TASK_STARTED';
export const CLOSE_TASK = '@@affectli/task/CLOSE_TASK';

export const LOAD_FORM_STARTED = '@@affectli/task/LOAD_FORM_STARTED';
export const LOAD_FORM = '@@affectli/task/LOAD_FORM';

export const TASK_SET_ASSIGNEE_STARTED = '@@affectli/task/TASK_SET_ASSIGNEE_STARTED';
export const TASK_SET_ASSIGNEE = '@@affectli/task/TASK_SET_ASSIGNEE';

export const TASK_SET_OWNER_STARTED = '@@affectli/task/TASK_SET_OWNER_STARTED';
export const TASK_SET_OWNER = '@@affectli/task/TASK_SET_OWNER';

export const ADD_TEAM_MEMBER_STARTED = '@@affectli/task/ADD_TEAM_MEMBER_STARTED';
export const ADD_TEAM_MEMBER = '@@affectli/task/ADD_TEAM_MEMBER';

export const REMOVE_TEAM_MEMBER_STARTED = '@@affectli/task/REMOVE_TEAM_MEMBER_STARTED';
export const REMOVE_TEAM_MEMBER = '@@affectli/task/REMOVE_TEAM_MEMBER';

export const ADD_SUBTASK_STARTED = '@@affectli/task/ADD_SUBTASK_STARTED';
export const ADD_SUBTASK = '@@affectli/task/ADD_SUBTASK';

export const LOAD_SUBTASKS_STARTED = '@@affectli/task/LOAD_SUBTASKS_STARTED';
export const LOAD_SUBTASKS = '@@affectli/task/LOAD_SUBTASKS';

export const LOAD_TASK_DETAILS_STARTED = '@@affectli/task/LOAD_TASK_DETAILS_STARTED';
export const LOAD_TASK_DETAILS = '@@affectli/task/LOAD_TASK_DETAILS';

export const OUTDATE_TASK_DETAILS = '@@affectli/task/OUTDATE_TASK_DETAILS';

export const TASK_UPDATE_STARTED = '@@affectli/task/TASK_UPDATE_STARTED';
export const TASK_UPDATE = '@@affectli/task/TASK_UPDATE';

export const LOAD_PROCESS_TASKS_STARTED = '@@affectli/task/LOAD_PROCESS_TASKS_STARTED';
export const LOAD_PROCESS_TASKS = '@@affectli/task/LOAD_PROCESS_TASKS';

export const LOAD_TASK_CHANGELOG_STARTED = '@@affectli/task/LOAD_TASK_CHANGELOG_STARTED';
export const LOAD_TASK_CHANGELOG = '@@affectli/task/LOAD_TASK_CHANGELOG';

export const SEND_TASK_MESSAGE_STARTED = '@@affectli/task/SEND_TASK_MESSAGE_STARTED';
export const SEND_TASK_MESSAGE = '@@affectli/task/SEND_TASK_MESSAGE';


/**
 * Loads the suggestions for the task candidate autocomplete component.
 */
export const loadTaskCandidateAutocomplete = loadData(
    LOAD_TASK_CANDIDATE_AUTOCOMPLETE_STARTED,
    LOAD_TASK_CANDIDATE_AUTOCOMPLETE,
    taskCandidateAutocompleteQuery
);

/**
 * Loads the suggestions for the task member autocomplete component.
 */
export const loadTaskMemberAutocomplete = loadData(
    LOAD_TASK_MEMBER_AUTOCOMPLETE_STARTED,
    LOAD_TASK_MEMBER_AUTOCOMPLETE,
    taskMemberAutocompleteQuery
);

/**
 * Fetch the task changelog.
 *
 * @param id the task ID.loadData
 */
export const loadTaskChangelog = (id: string, options: Object) => (dispatch: Function) => {
    dispatch({ type: LOAD_TASK_CHANGELOG_STARTED });
    return graphql.query({
        query: taskChangelogQuery,
        variables: { id, ...options },
        fetchPolicy: 'no-cache',
    }).then((response: Object): void => {
        const payload = {
            changes: get(response, 'data.task.changelog'),
            startIndex: options.startIndex,
            count: get(response, 'data.count'),
        };
        dispatch({ type: LOAD_TASK_CHANGELOG, payload });
    }).catch((error) => {
        dispatch({ type: LOAD_TASK_CHANGELOG, payload: error, error: true });
    });
};


/**
 * Loads the assigned tasks.
 */
export const loadTasks = (options: Object = {}) => {
    const variables = new OptionsBuilder(options).defaultStartStopIndexs(0, 30).build();
    return loadData(LOAD_TASKS_STARTED, LOAD_TASKS, tasksQuery)({ ...variables, startIndex: options.startIndex });
};


/**
 * Loads the assigned tasks for the A-Box timeline.
 */
export const loadTimelineTasks = (options: Object = {}, start: Date, end: Date) => {
    let variables;

    // if start and end is not null use range of timeline as filter. Else, use startDate and dueDate as filter
    if (start && end) {
        variables = new OptionsBuilder(options)
            .defaultStartStopIndexs(0, 30)
            .filter({ field: 'bpmnVariables.name', op: '=', value: 'startDate' })
            .filter({ field: 'dueDate', op: 'is not null' })
            .filter({ or: [
                [
                    [
                        { field: 'bpmnVariables.name', op: '=', value: 'startDate' },
                        { field: 'bpmnVariables.text', op: 'between', value: [start, end] }
                    ],
                ],
                { field: 'dueDate', op: 'between', value: [start, end] },
                [
                    [
                        { field: 'bpmnVariables.name', op: '=', value: 'startDate' },
                        { field: 'bpmnVariables.text', op: '<', value: end }
                    ],
                    { field: 'dueDate', op: '>', value: start },
                ]
            ] })
            .build();
    } else {
        variables = new OptionsBuilder(options)
            .defaultStartStopIndexs(0, 30)
            .filter({ field: 'bpmnVariables.name', op: '=', value: 'startDate' })
            .filter({ field: 'dueDate', op: 'is not null' })
            .build();
    }

    return loadData(LOAD_TIMELINE_TASKS_STARTED, LOAD_TIMELINE_TASKS, tasksTimelineQuery)({ ...variables });
};


/**
* Loads the assigned tasks for the A-Box calendar.
 */
export const loadCalendarTasks = (userId: number, start: Date, end: Date, options: Object = {}) => {
    if (!userId || !start || !end) {
        throw new Error('userID, start and end are required.');
    }
    const variables = new OptionsBuilder(options)
        .defaultStartStopIndexs(0, 30)
        // filter date where:
        // (startDate between start and end and dueDate is null)
        // or (startDate is null and dueDate between start and end)
        // or (startDate < end and dueDate > start)
        .filter({ or: [
            [
                [
                    { field: 'bpmnVariables.name', op: '=', value: 'startDate' },
                    { field: 'bpmnVariables.text', op: 'between', value: [start, end] }
                ],
                { field: 'dueDate', op: 'is null' },
            ],
            // I can't verify if start date is null
            { field: 'dueDate', op: 'between', value: [start, end] },
            [
                [
                    { field: 'bpmnVariables.name', op: '=', value: 'startDate' },
                    { field: 'bpmnVariables.text', op: '<', value: end }
                ],
                { field: 'dueDate', op: '>', value: start },
            ]
        ] })
        .build();
    return loadData(LOAD_CALENDAR_TASKS_STARTED, LOAD_CALENDAR_TASKS, tasksCalendarQuery)({ ...variables });
};

export const closeTask = (id: string) =>
    mutateData(CLOSE_TASK_STARTED, CLOSE_TASK, closeTaskMutation, 'The task has been closed.')({ id });

export const addSubtask = (parentTaskId: string, data: Object) =>
    mutateData(
        ADD_SUBTASK_STARTED,
        ADD_SUBTASK,
        createSubtaskMutation,
        `Sub-task ${data.name || ''} added successfully.`,
    )({ record: { ...data, parentTaskId } });

export const setTaskAssignee = (id: string, assignee: Object) =>
    mutateData(
        TASK_SET_ASSIGNEE_STARTED,
        TASK_SET_ASSIGNEE,
        setTaskAssigneeMutation,
        'Task assigned succesfully.'
    )({ id, assignee });

export const setTaskOwner = (id: string, owner: Object) =>
    mutateData(
        TASK_SET_OWNER_STARTED,
        TASK_SET_OWNER,
        setTaskOwnerMutation,
        'The owner of the task has been changed.'
    )({ id, owner });

export const addTeamMember = (id: string, family: string, memberId: number) =>
    mutateData(
        ADD_TEAM_MEMBER_STARTED,
        ADD_TEAM_MEMBER,
        addTeamMemberToTaskMutation,
        'Team member successfully added.',
    )({ id, family, memberId });

export const removeTeamMember = (id: string, family: string, memberId: number) =>
    mutateData(
        REMOVE_TEAM_MEMBER_STARTED,
        REMOVE_TEAM_MEMBER,
        removeTeamMemberFromTaskMutation,
        'Team member successfully removed.',
    )({ id, family, memberId });

/**
 * Change the priority of the task
 */
export const setTaskPriority = (taskId: string, priority: number) => updateTask({ id: taskId, priority: priority });

export const loadSubtasks = (options: Object = {}) => {
    const variables = new OptionsBuilder(options)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'parent.id', op: '=', value: String(options.id) })
        .build();
    return loadData(LOAD_SUBTASKS_STARTED, LOAD_SUBTASKS, subtasksQuery)({ ...variables });
};


/**
 * Sets the task details as outdated.
 */
export const outdateTaskDetails = (id: string, outdate: ?boolean = true) => (dispatch: Function, getState: Function) => {
    if (id && id === get(getState(), 'abox.task.details.data.id')) {
        dispatch({ type: OUTDATE_TASK_DETAILS, payload: outdate });
    }
};

/**
 * Loads the task details.
 */
export const loadTaskDetails = (id: string) => (dispatch: Function, getState: Function) => {
    if (!id) {
        throw new Error('The ID is required.');
    }
    return loadData(LOAD_TASK_DETAILS_STARTED, LOAD_TASK_DETAILS, taskQuery)({ id })(dispatch, getState)
        .then(() => outdateTaskDetails(id, false)(dispatch, getState));
};

/**
 * Updates the task details
 */
export const updateTask = (record: Object) =>
    mutateData(TASK_UPDATE_STARTED, TASK_UPDATE, updateTaskMutation, 'Task updated successfully')({ record });

export const loadProcessTasks = (processId: string) => {
    const variables = {
        filterBy: [{ field: 'process.id', op: '=', value: processId }],
        processId // we need the processId in the meta of the action for the reducer
    };
    return loadData(LOAD_PROCESS_TASKS_STARTED, LOAD_PROCESS_TASKS, processTasksQuery)(variables);
};

export const sendTaskMessage = (url: string) => (dispatch: Function) => {
    dispatch({ type: SEND_TASK_MESSAGE_STARTED });
    return HttpFetch.putResource(url, {})
        .then((resp: Object): void => {
            dispatch({
                type: SEND_TASK_MESSAGE,
                payload: Immutable(resp),
                meta: Immutable({ successMessage: 'Successfully Sent' })
            });
        })
        .catch((error: Error): void => {
            dispatch( { type: SEND_TASK_MESSAGE, payload: Immutable(error), error: true } );
        });
};

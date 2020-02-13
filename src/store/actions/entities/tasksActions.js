/* @flow */
import { loadData } from 'app/utils/redux/action-utils';
import autocompleteQuery from 'graphql/entities/tasks/tasksAutocompleteQuery';

export const LOAD_TASKS_AUTOCOMPLETE_STARTED: string = '@@affectli/entities/tasks/LOAD_TASKS_AUTOCOMPLETE_STARTED';
export const LOAD_TASKS_AUTOCOMPLETE: string = '@@affectli/entities/tasks/LOAD_TASKS_AUTOCOMPLETE';

export const loadTasksAutocomplete = loadData(
    LOAD_TASKS_AUTOCOMPLETE_STARTED,
    LOAD_TASKS_AUTOCOMPLETE,
    autocompleteQuery
);

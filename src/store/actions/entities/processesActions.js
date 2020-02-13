/* @flow */
import { loadData } from 'app/utils/redux/action-utils';
import autocompleteQuery from 'graphql/entities/processes/processesAutocompleteQuery';

export const LOAD_PROCESSES_AUTOCOMPLETE_STARTED: string = '@@affectli/entities/processes/LOAD_PROCESSES_AUTOCOMPLETE_STARTED';
export const LOAD_PROCESSES_AUTOCOMPLETE: string = '@@affectli/entities/processes/LOAD_PROCESSES_AUTOCOMPLETE';

export const loadProcessesAutocomplete = loadData(
    LOAD_PROCESSES_AUTOCOMPLETE_STARTED,
    LOAD_PROCESSES_AUTOCOMPLETE,
    autocompleteQuery
);

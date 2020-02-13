/* @flow */
import { get } from 'app/utils/lo/lo';
import { loadData, loadTableData, mutateData } from 'app/utils/redux/action-utils';

import personAutocompleteQuery from 'graphql/entities/people/personAutocompleteQuery';
import peopleQuery from 'graphql/entities/people/peopleQuery';
import personQueryBuilder from 'graphql/entities/people/personQueryBuilder';
import savePersonMutation from 'graphql/entities/people/savePersonMutation';

export const LOAD_PEOPLE_LIST_STARTED: string = '@@affectli/entities/people/LOAD_PEOPLE_LIST_STARTED';
export const LOAD_PEOPLE_LIST: string = '@@affectli/entities/people/LOAD_PEOPLE_LIST';

export const LOAD_PERSON_STARTED: string = '@@affectli/entities/people/LOAD_PERSON_STARTED';
export const LOAD_PERSON: string = '@@affectli/entities/people/LOAD_PERSON';

export const UPDATE_PERSON_STARTED: string = '@@affectli/entities/people/UPDATE_PERSON_STARTED';
export const UPDATE_PERSON: string = '@@affectli/entities/people/UPDATE_PERSON';

export const OPEN_PERSON_STARTED: string = '@@affectli/entities/people/OPEN_PERSON_STARTED';
export const OPEN_PERSON: string = '@@affectli/entities/people/OPEN_PERSON';

export const LOAD_PERSON_AUTOCOMPLETE_STARTED = '@@affectli/entities/people/LOAD_PERSON_AUTOCOMPLETE_STARTED';
export const LOAD_PERSON_AUTOCOMPLETE = '@@affectli/entities/people/LOAD_PERSON_AUTOCOMPLETE';

/**
 * Loads the suggestions for the person autocomplete component.
 */
export const loadPersonAutocomplete = loadData(LOAD_PERSON_AUTOCOMPLETE_STARTED, LOAD_PERSON_AUTOCOMPLETE, personAutocompleteQuery);

/**
 * load people list for datatable
 *
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 */
export const loadPeopleList = loadTableData(LOAD_PEOPLE_LIST_STARTED, LOAD_PEOPLE_LIST, peopleQuery);

/**
 * Load the detail of the specified Person
 *
 * @param id the ID of the Person to load
 */
export const loadPerson = (id: string) => loadData(LOAD_PERSON_STARTED, LOAD_PERSON, personQueryBuilder(Number(id)))({ id });

export const savePerson = (record: Object) =>
    mutateData(
        UPDATE_PERSON_STARTED,
        UPDATE_PERSON,
        savePersonMutation,
        !get(record, 'id', false) ? 'Person added.' : 'Person updated.'
    )({ record });

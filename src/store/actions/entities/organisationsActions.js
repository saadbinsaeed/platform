/* @flow */

import { loadData, loadTableData, mutateData } from 'app/utils/redux/action-utils';
import { get } from 'app/utils/lo/lo';

import organisationAutocompleteQuery from 'graphql/entities/organisations/organisationAutocompleteQuery';
import organisationsQuery from 'graphql/entities/organisations/organisationsQuery';
import organisationQueryBuilder from 'graphql/entities/organisations/organisationQueryBuilder';
import saveOrganisationMutation from 'graphql/entities/organisations/saveOrganisationMutation';
import organisationChildrenQuery from 'graphql/entities/organisations/organisationChildrenQuery';

export const SAVE_ORGANISATION_STARTED: string = '@@affectli/entities/organisation/SAVE_ORGANISATION_STARTED';
export const SAVE_ORGANISATION: string = '@@affectli/entities/organisation/SAVE_ORGANISATION';

export const LOAD_ORGANISATION_CHILDREN_STARTED: string = '@@affectli/entities/organisation/LOAD_ORGANISATION_CHILDREN_STARTED';
export const LOAD_ORGANISATION_CHILDREN: string = '@@affectli/entities/organisation/LOAD_ORGANISATION_CHILDREN';

export const LOAD_ORGANISATIONS_STARTED: string = '@@affectli/entities/organisations/LOAD_ORGANISATIONS_STARTED';
export const LOAD_ORGANISATIONS: string = '@@affectli/entities/organisations/LOAD_ORGANISATIONS';

export const LOAD_ORGANISATION_STARTED: string = '@@affectli/entities/organisation/LOAD_ORGANISATION_STARTED';
export const LOAD_ORGANISATION: string = '@@affectli/entities/organisation/LOAD_ORGANISATION';

export const LOAD_ORGANISATION_AUTOCOMPLETE_STARTED = '@@affectli/users/LOAD_ORGANISATION_AUTOCOMPLETE_STARTED';
export const LOAD_ORGANISATION_AUTOCOMPLETE = '@@affectli/users/LOAD_ORGANISATION_AUTOCOMPLETE';

/**
 * Loads the suggestions for the organisation autocomplete component.
 */
export const loadOrganisationAutocomplete = loadData(LOAD_ORGANISATION_AUTOCOMPLETE_STARTED, LOAD_ORGANISATION_AUTOCOMPLETE, organisationAutocompleteQuery);

/**
 * Load the detail of the specified Organisation
 *
 * @param id the ID of the Organisation to load
 */
export const loadOrganisation = (id: string) => loadData(LOAD_ORGANISATION_STARTED, LOAD_ORGANISATION, organisationQueryBuilder(Number(id)))({ id });

export const saveOrganisation = (record: Object) =>
    mutateData(
        SAVE_ORGANISATION_STARTED,
        SAVE_ORGANISATION,
        saveOrganisationMutation,
        !get(record, 'id', false) ? 'Organisation added.' : 'Organisation updated.'
    )({ record });

/**
 * Load organisations
 *
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 */
export const loadOrganisationsList = loadTableData(LOAD_ORGANISATIONS_STARTED, LOAD_ORGANISATIONS, organisationsQuery);

/**
 * Load the children of the specified Thing.
 *
 * @param id parents id
 */
export const loadOrganisationChildren = (id: string) =>
    loadData(LOAD_ORGANISATION_CHILDREN_STARTED, LOAD_ORGANISATION_CHILDREN, organisationChildrenQuery)({ id, filterBy: [{ field: 'parent.id', op: '=', value: id }] });

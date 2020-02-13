/* @flow */

import { loadData, mutateData } from 'app/utils/redux/action-utils';
import OptionsBuilder from 'app/utils/api/OptionsBuilder';

import formDefinitionQuery from 'graphql/designer/formDefinitionQuery';
import designerFormListQuery from 'graphql/designer/designerFormListQuery';
import createFormDefinitionMutation from 'graphql/designer/createFormDefinitionMutation';
import cloneFormDefinitionMutation from 'graphql/designer/cloneFormDefinitionMutation';
import deleteFormDefinitionMutation from 'graphql/designer/deleteFormDefinitionMutation';
import updateFormDefinitionMutation from 'graphql/designer/updateFormDefinitionMutation';
import shareFormDefinitionMutation from 'graphql/designer/shareFormDefinitionMutation';

export const LOAD_FORMS_DEFINITIONS_STARTED: string = '@@affectli/designer/LOAD_DESIGNER_FORMS_STARTED';
export const LOAD_FORMS_DEFINITIONS: string = '@@affectli/designer/LOAD_DESIGNER_FORMS';

export const LOAD_FORM_DEFINITION_STARTED: string = '@@affectli/designer/LOAD_FORM_DEFINITION_STARTED';
export const LOAD_FORM_DEFINITION: string = '@@affectli/designer/LOAD_FORM_DEFINITION';

export const CREATE_FORM_DEFINITION_STARTED: string = '@@affectli/designer/CREATE_FORM_DEFINITION_STARTED';
export const CREATE_FORM_DEFINITION: string = '@@affectli/designer/CREATE_FORM_DEFINITION';

export const UPDATE_FORM_DEFINITION_STARTED: string = '@@affectli/designer/UPDATE_FORM_DEFINITION_STARTED';
export const UPDATE_FORM_DEFINITION: string = '@@affectli/designer/UPDATE_FORM_DEFINITION';

export const CLONE_FORM_DEFINITION_STARTED: string = '@@affectli/designer/CLONE_FORM_DEFINITION_STARTED';
export const CLONE_FORM_DEFINITION: string = '@@affectli/designer/CLONE_FORM_DEFINITION';

export const DELETE_FORM_DEFINITION_STARTED: string = '@@affectli/designer/DELETE_FORM_DEFINITION_STARTED';
export const DELETE_FORM_DEFINITION: string = '@@affectli/designer/DELETE_FORM_DEFINITION';

export const SHARE_FORM_DEFINITION_STARTED: string = '@@affectli/designer/SHARE_FORM_DEFINITION_STARTED';
export const SHARE_FORM_DEFINITION: string = '@@affectli/designer/SHARE_FORM_DEFINITION';

/**
 * Loads the forms' definitions.
 */
export const loadDesignerForms = (options: Object = {}) => {
    const variables = new OptionsBuilder(options)
        .defaultStartStopIndexs(0, 30)
        .filter({ field: 'definition.version', op: 'is not null' })
        .build();
    return loadData(
        LOAD_FORMS_DEFINITIONS_STARTED,
        LOAD_FORMS_DEFINITIONS,
        designerFormListQuery
    )({ ...variables, startIndex: options.startIndex });
};

/**
 * Loads the form definition with the given id.
 */
export const loadFormDefinition = (id: number) =>
    loadData(LOAD_FORM_DEFINITION_STARTED, LOAD_FORM_DEFINITION, formDefinitionQuery)({ id });

/**
 * Creates a new the form definition.
 */
export const createFormDefinition = (record: Object) =>
    mutateData(
        CREATE_FORM_DEFINITION_STARTED,
        CREATE_FORM_DEFINITION,
        createFormDefinitionMutation,
        'Form created succesfully.'
    )({ record });

/**
 * Updates a form definition.
 */
export const updateFormDefinition = (record: Object, newVersion: ?boolean, overwriteDeployed: ?boolean) =>
    mutateData(
        UPDATE_FORM_DEFINITION_STARTED,
        UPDATE_FORM_DEFINITION,
        updateFormDefinitionMutation,
        'Form updated succesfully.'
    )({ record, newVersion, overwriteDeployed });

/**
 * Creates a new the form definition.
 */
export const cloneFormDefinition = (id: number, record: Object) =>
    mutateData(
        CLONE_FORM_DEFINITION_STARTED,
        CLONE_FORM_DEFINITION,
        cloneFormDefinitionMutation,
        'Form duplicated succesfully.'
    )({ id, record });

/**
 * Creates a new the form definition.
 */
export const deleteFormDefinition = (id: number, record: Object) =>
    mutateData(
        DELETE_FORM_DEFINITION_STARTED,
        DELETE_FORM_DEFINITION,
        deleteFormDefinitionMutation,
        'Form deleted succesfully.'
    )({ id, record });

/**
 * Creates a new the form definition.
 */
export const shareFormDefinition = (id: number, shares: Object) =>
    mutateData(
        SHARE_FORM_DEFINITION_STARTED,
        SHARE_FORM_DEFINITION,
        shareFormDefinitionMutation,
        'Form shared succesfully.'
    )({ id, shares: shares.map(({ user, permission }) => ({ user: { id: user.id }, permission }))});

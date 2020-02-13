/* @flow */
import history from 'store/History';
import { loadData, loadTableData } from 'app/utils/redux/action-utils';
import { mutateData } from 'app/utils/redux/action-utils';

import classificationAutocompleteQuery from 'graphql/entities/classifications/classificationAutocompleteQuery';
import classificationsQuery from 'graphql/entities/classifications/classificationsQuery';
import classificationDetailQuery from 'graphql/entities/classifications/classificationDetailQuery';
import createClassificationMutation from 'graphql/entities/classifications/createClassificationMutation';
import updateClassificationMutation from 'graphql/entities/classifications/updateClassificationMutation';
import entitiesQuery from 'graphql/entities/entities/entitiesQuery';

export const UPDATE_ENTITY_CLASSIFICATION = '@@affectli/classifications/UPDATE_ENTITY_CLASSIFICATION';

export const UPDATE_CLASSIFICATION_STARTED = '@@affectli/classifications/UPDATE_CLASSIFICATION_STARTED';
export const UPDATE_CLASSIFICATION = '@@affectli/classifications/UPDATE_CLASSIFICATION';

export const CREATE_CLASSIFICATION_STARTED = '@@affectli/classifications/CREATE_CLASSIFICATION_STARTED';
export const CREATE_CLASSIFICATION = '@@affectli/classifications/CREATE_CLASSIFICATION';

export const LOAD_CLASSIFICATIONS_STARTED = '@@affectli/classifications/LOAD_CLASSIFICATIONS_STARTED';
export const LOAD_CLASSIFICATIONS = '@@affectli/classifications/LOAD_CLASSIFICATIONS';

export const LOAD_CLASSIFICATION_STARTED = '@@affectli/classifications/LOAD_CLASSIFICATION_STARTED';
export const LOAD_CLASSIFICATION = '@@affectli/classifications/LOAD_CLASSIFICATION';

export const LOAD_CLASSIFICATION_ENTITIES_STARTED = '@@affectli/classifications/entities/LOAD_CLASSIFICATION_ENTITIES_STARTED';
export const LOAD_CLASSIFICATION_ENTITIES = '@@affectli/classifications/LOAD_CLASSIFICATION_ENTITIES';

export const LOAD_CLASSIFICATION_AUTOCOMPLETE_STARTED = '@@affectli/admin/groups/LOAD_CLASSIFICATION_AUTOCOMPLETE_STARTED';
export const LOAD_CLASSIFICATION_AUTOCOMPLETE = '@@affectli/admin/groups/LOAD_CLASSIFICATION_AUTOCOMPLETE';

/**
 * Loads the suggestions for the person autocomplete component.
 */
export const loadClassificationAutocomplete = loadData(
    LOAD_CLASSIFICATION_AUTOCOMPLETE_STARTED,
    LOAD_CLASSIFICATION_AUTOCOMPLETE,
    classificationAutocompleteQuery
);

/**
 * This function will load the classification detail on a given id
 */
export const loadClassification = (id: Number) => loadData(LOAD_CLASSIFICATION_STARTED, LOAD_CLASSIFICATION, classificationDetailQuery)({ id });

/**
 * Load the loads the entities for the DataTable
 *
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download,  })
 */
export const loadClassificationEntities = (options: Object) => {
    return loadTableData(LOAD_CLASSIFICATION_ENTITIES_STARTED, LOAD_CLASSIFICATION_ENTITIES, entitiesQuery)(options);
};


export const updateClassification = (classification: Object) => (dispatch: Function, getState: Function) => {
    /**
     * Problem is that classificationDetailQuery does not provide childrenUris
     * it provides the children object ( which Classification dropdown do not receives ) with id and uri but we cant save that children object as ClassificationUpdateInput of updateClassification requires children to only contain uris or array of childrenUris which classificationDetailQuery does not provide.
     * Solution 1: reducer-utils should allow the user to tranform data to any required format before saving data to the redux store
     * Solution 2: do not use the reducer-utils, make a custom reducer, manipulate the data before saving it to the store
     * solution 3: classificationDetailQuery should provide childrenUris ( array of uri strings )
     * solution 4: Implemented in the below line
     */
    return mutateData(UPDATE_CLASSIFICATION_STARTED, UPDATE_CLASSIFICATION, updateClassificationMutation, 'Classifcation updated.')({ classification })( dispatch, getState)
        .then((payload) => {
            if (!(payload instanceof Error)) {
                dispatch({ type: LOAD_CLASSIFICATION, payload });
            }
        });
};

/**
 * This function will create classification by receiving a classification object
 * Classifification object should only contain "name" and "uri"
 */
export const createClassification = (classification: Object) => (dispatch: Function, getState: Function) => {
    mutateData(CREATE_CLASSIFICATION_STARTED, CREATE_CLASSIFICATION, createClassificationMutation, 'Classifcation created.')({ classification })(dispatch, getState)
        .then(({ id }) => {
            if (id) {
                history.push(`/classifications/${id}`);
            }
        });
};
/**
 * Load classes for DataTable
 *
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 */
export const loadClassifications = loadTableData(LOAD_CLASSIFICATIONS_STARTED, LOAD_CLASSIFICATIONS, classificationsQuery);

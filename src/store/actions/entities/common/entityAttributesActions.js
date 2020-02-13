/* @flow */
import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';
import { dispatchError, mutateData } from 'app/utils/redux/action-utils';

import entityClassesAttributesQuery from 'graphql/entities/common/classifications/entityClassesAttributesQuery';
import saveEntityMutation from 'graphql/entities/entities/saveEntityMutation';

export const LOAD_ENTITY_CLASSES_AND_ATTRIBUTES_STARTED = '@@affectli/entities/common/classifications/LOAD_ENTITY_CLASSES_AND_ATTRIBUTES_STARTED';
export const LOAD_ENTITY_CLASSES_AND_ATTRIBUTES = '@@affectli/entities/common/classifications/LOAD_ENTITY_CLASSES_AND_ATTRIBUTES';

export const UPDATE_ENTITY_ATTRIBUTES_STARTED = '@@affectli/entities/common/classifications/UPDATE_ENTITY_ATTRIBUTES_STARTED';
export const UPDATE_ENTITY_ATTRIBUTES = '@@affectli/entities/common/classifications/UPDATE_ENTITY_ATTRIBUTES';

export const normalizeClass = (classification: Object) => {
    const fields = (classification.formDefinitions || {}).fields || [];
    // get the fields' groups names removing the duplicates
    const fieldGroupsNames = Array.from(new Set(fields.map(({ group_name }) => group_name || 'Ungrouped')));
    return {
        ...classification,
        groups: fieldGroupsNames.map(name => ({
            name: name,
            fields: fields.filter(({ group_name }) => (group_name || 'Ungrouped') === name),
        })),
    };
};

const _loadEntityAttrClasses = (id: ?number): Promise<?Object> => {
    if (!id) {
        return Promise.resolve(null);
    }
    return graphql.query({
        query: entityClassesAttributesQuery,
        variables: { id },
        fetchPolicy: 'no-cache'
    }).then((response: Object): void => {
        const data = Immutable(get(response, 'data.result') || []);
        const classes = (data.classes || []).map(normalizeClass);
        return { ...data, classes };
    });
};

export const loadEntityClassesAndAttributes = (id: ?number) => (dispatch: Function, getState: Function): Promise<?Object | Error> => {
    dispatch({ type: LOAD_ENTITY_CLASSES_AND_ATTRIBUTES_STARTED });
    return _loadEntityAttrClasses(id).then((data: ?Object) => {
        dispatch({ type: LOAD_ENTITY_CLASSES_AND_ATTRIBUTES, payload: Immutable(data) });
        return Immutable(data);
    }).catch(dispatchError(dispatch, LOAD_ENTITY_CLASSES_AND_ATTRIBUTES_STARTED));
};

export const saveEntityAttributes = (id: number, attributes: Object) =>
    mutateData(
        UPDATE_ENTITY_ATTRIBUTES_STARTED,
        UPDATE_ENTITY_ATTRIBUTES,
        saveEntityMutation,
        'Attributes updated.',
    )({ record: { id, attributes } });

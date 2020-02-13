/* @flow */

import { loadData, loadTableData, mutateData } from 'app/utils/redux/action-utils';

import relationshipsQuery from 'graphql/entities/relationships/relationshipsQuery';
import createRelationMutation from 'graphql/entities/relationships/createRelationMutation';
import updateRelationMutation from 'graphql/entities/relationships/updateRelationMutation';
import deleteRelationMutation from 'graphql/entities/relationships/deleteRelationMutation';
import relationDefinitionAutocompleteQuery from 'graphql/entities/relationships/relationDefinitionAutocompleteQuery';
import addRelationshipsQueryBuilder from 'graphql/entities/relationships/addRelationshipsQuery';
import OptionsBuilder from 'app/utils/api/OptionsBuilder';
import loadRelationshipClassificationsQuery from 'graphql/entities/relationships/relationshipClassificationsQuery';
import singleRelationshipQuery from 'graphql/entities/relationships/singleRelationshipQuery';
import entityDataQueryBuilder from 'graphql/common/entityDataQueryBuilder';

export const ADD_RELATIONSHIP_STARTED = '@@affectli/relationships/ADD_RELATIONSHIP_STARTED';
export const ADD_RELATIONSHIP = '@@affectli/relationships/ADD_RELATIONSHIP';

export const UPDATE_RELATIONSHIP_STARTED = '@@affectli/relationships/UPDATE_RELATIONSHIP_STARTED';
export const UPDATE_RELATIONSHIP = '@@affectli/relationships/UPDATE_RELATIONSHIP';

export const REMOVE_RELATIONSHIP_STARTED = '@@affectli/relationships/REMOVE_RELATIONSHIP_STARTED';
export const REMOVE_RELATIONSHIP = '@@affectli/relationships/REMOVE_RELATIONSHIP';

export const GET_RELATIONSHIPS_STARTED = '@@affectli/relationships/GET_RELATIONSHIPS_STARTED';
export const GET_RELATIONSHIPS = '@@affectli/relationships/GET_RELATIONSHIPS';

export const GET_RELATIONSHIP_STARTED = '@@affectli/relationships/GET_RELATIONSHIP_STARTED';
export const GET_RELATIONSHIP = '@@affectli/relationships/GET_RELATIONSHIP';

export const LOAD_RELATION_DEFINITION_AUTOCOMPLETE_STARTED = '@@affectli/admin/groups/LOAD_CLASSIFICATION_AUTOCOMPLETE_STARTED';
export const LOAD_RELATION_DEFINITION_AUTOCOMPLETE = '@@affectli/admin/groups/LOAD_CLASSIFICATION_AUTOCOMPLETE';

export const LOAD_RELATIONSHIP_ENTITIES_ADD_STARTED = '@@affectli/entities/relationships/LOAD_RELATIONSHIP_ENTITIES_ADD_STARTED';
export const LOAD_RELATIONSHIP_ENTITIES_ADD = '@@affectli/entities/relationships/LOAD_RELATIONSHIP_ENTITIES_ADD';

export const LOAD_RELATIONSHIP_CLASSIFICATIONS_STARTED = '@@affectli/entities/relationships/LOAD_RELATIONSHIP_CLASSIFICATIONS_STARTED';
export const LOAD_RELATIONSHIP_CLASSIFICATIONS = '@@affectli/entities/relationships/LOAD_RELATIONSHIP_CLASSIFICATIONS';

export const LOAD_ENTITY_DATA_STARTED = '@@affectli/entities/relationships/LOAD_ENTITY_DATA_STARTED';
export const LOAD_ENTITY_DATA = '@@affectli/entities/relationships/LOAD_ENTITY_DATA';


export const loadEntityData = (id: String, entityType: string) => {
    const type = entityType === 'custom' ? 'customEntity' : entityType;
    return loadData(LOAD_ENTITY_DATA_STARTED, LOAD_ENTITY_DATA, entityDataQueryBuilder({ type, id }))({});
};

/**
 * Loads the suggestions for the person autocomplete component.
 */
export const loadRelationDefinitionAutocomplete =
    loadData(
        LOAD_RELATION_DEFINITION_AUTOCOMPLETE_STARTED,
        LOAD_RELATION_DEFINITION_AUTOCOMPLETE,
        relationDefinitionAutocompleteQuery,
    );

const buildRelationshipWhere = (entityId: string, type1: string, type2: string, isAdmin: boolean = false, direction: boolean = true) => {
    const eType = type1 === 'custom' ? 'customEntity' : type1;
    const eType2 = type2 === 'custom' ? 'customEntity' : type2;
    const where = [
        { field: `${eType}${direction ? 1 : 2}.id`, op: '=', value: entityId },
        { field: `relationDefinition.entityType${direction ? 1 : 2}`, op: '=', value: type1 },
        { field: `relationDefinition.entityType${direction ? 2 : 1}`, op: '=', value: type2 },
        { field: `${eType2}${direction ? 2 : 1}.id`, op: 'is not null' },
    ];
    if (!isAdmin) {
        where.push({ field: 'relationDefinition.customEntity.active', op: '=', value: true });
    }
    return where;
};

export const updateRelationship = (record: Object) => {
    return mutateData(
        UPDATE_RELATIONSHIP_STARTED,
        UPDATE_RELATIONSHIP,
        updateRelationMutation,
        'Relationship updated',
    )({ record });
};

/**
 * Loads the relationships related to an Entity for the DataTable.
 *
 * @param entityId the entity ID
 * @param type1 the entity type
 * @param type2 related entity type
 * @param options the base URI
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 * @param isAdmin boolean is user an admin
 */
export const fetchEntityRelationships = (entityId: string, type1: string, type2: string, options: Object, isAdmin: boolean = false) => {

    const variables = new OptionsBuilder(options, { legacyWhere: true })
        .filter({
            or: [
                buildRelationshipWhere(entityId, type1, type2, isAdmin, true),
                buildRelationshipWhere(entityId, type1, type2, isAdmin, false),
            ],
        })
        .build();
    return loadTableData(GET_RELATIONSHIPS_STARTED, GET_RELATIONSHIPS, relationshipsQuery)(variables);
};

/**
 * Delete the relation with the given ID.
 *
 * @param id the relation ID.
 */
export const deleteRelationship = (id: number) => {
    return mutateData(
        REMOVE_RELATIONSHIP_STARTED,
        REMOVE_RELATIONSHIP,
        deleteRelationMutation,
        'Relationship removed',
    )({ id });
};

/**
 * Save a relationship between two entities.
 *
 * @param record record to save
 */
export const createRelationship = (record: Object) => {
    return mutateData(
        ADD_RELATIONSHIP_STARTED,
        ADD_RELATIONSHIP,
        createRelationMutation,
        'Relationship added',
    )({ record });
};

const entitiesQueryType = {
    thing: 'things',
    person: 'people',
    organisation: 'organisations',
    custom: 'customEntities',
    task: 'tasks',
    process: 'processes',
};

export const loadRelationshipAddEntities = (options: Object, type: string = 'entity') => {
    const nType = type === 'custom' ? 'customEntity' : type;
    const nQuery = entitiesQueryType[type] || 'entities';
    const variables = new OptionsBuilder(options).defaultStartStopIndexs(0, 30).build();

    return loadData(
        LOAD_RELATIONSHIP_ENTITIES_ADD_STARTED,
        LOAD_RELATIONSHIP_ENTITIES_ADD,
        addRelationshipsQueryBuilder(nType, nQuery)
    )({ ...variables, startIndex: options.startIndex });
};

export const loadRelationship = (id: number) => loadData(
    GET_RELATIONSHIP_STARTED,
    GET_RELATIONSHIP,
    singleRelationshipQuery
)({ id });

export const loadClassificationAttributes = ({ id }: { id: number }) => loadData(
    LOAD_RELATIONSHIP_CLASSIFICATIONS_STARTED,
    LOAD_RELATIONSHIP_CLASSIFICATIONS,
    loadRelationshipClassificationsQuery
)({ id });

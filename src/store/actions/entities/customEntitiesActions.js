/* @flow */
import { get } from 'app/utils/lo/lo';
import { loadData, loadTableData, mutateData } from 'app/utils/redux/action-utils';
//
import customEntitiesQuery from 'graphql/entities/customEntities/customEntitiesQuery';
import customEntityDetailQueryBuilder from 'graphql/entities/customEntities/customEntityDetailQueryBuilder';
import saveCustomEntityMutation from 'graphql/entities/customEntities/saveCustomEntityMutation';
import customEntityAutocompleteQuery from 'graphql/entities/customEntities/customEntityAutocompleteQuery';
import customEntitiesChildrenQuery from 'graphql/entities/customEntities/customEntitiesChildrenQuery';


export const LOAD_CUSTOM_ENTITIES_LIST_STARTED: string = '@@affectli/entities/customEntities/LOAD_CUSTOM_ENTITIES_LIST_STARTED';
export const LOAD_CUSTOM_ENTITIES_LIST: string = '@@affectli/entities/customEntities/LOAD_CUSTOM_ENTITIES_LIST';

export const LOAD_CUSTOM_ENTITY_DETAILS_STARTED: string = '@@affectli/entities/customEntities/LOAD_CUSTOM_ENTITY_DETAILS_STARTED';
export const LOAD_CUSTOM_ENTITY_DETAILS: string = '@@affectli/entities/customEntities/LOAD_CUSTOM_ENTITY_DETAILS';

export const CUSTOM_ENTITY_SAVE_STARTED: string = '@@affectli/entities/customEntities/CUSTOM_ENTITY_SAVE_STARTED';
export const CUSTOM_ENTITY_SAVE: string = '@@affectli/entities/customEntities/CUSTOM_ENTITY_SAVE';

export const LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE_STARTED: string = '@@affectli/entities/customEntities/LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE_STARTED';
export const LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE: string = '@@affectli/entities/customEntities/LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE';

export const LOAD_CUSTOM_ENTITY_CHILDREN_STARTED: string = '@@affectli/entities/customEntities/LOAD_CUSTOM_ENTITY_CHILDREN_STARTED';
export const LOAD_CUSTOM_ENTITY_CHILDREN: string = '@@affectli/entities/customEntities/LOAD_CUSTOM_ENTITY_CHILDREN';



export const loadCustomEntitesAutocomplete = loadData(
    LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE_STARTED,
    LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE,
    customEntityAutocompleteQuery
);

export const loadCustomEntities = loadTableData(LOAD_CUSTOM_ENTITIES_LIST_STARTED, LOAD_CUSTOM_ENTITIES_LIST, customEntitiesQuery);

export const loadCustomEntity = (id: string) => loadData(
    LOAD_CUSTOM_ENTITY_DETAILS_STARTED,
    LOAD_CUSTOM_ENTITY_DETAILS,
    customEntityDetailQueryBuilder(Number(id))
)({ id });


export const saveCustomEntity = (record: Object) =>
    mutateData(
        CUSTOM_ENTITY_SAVE_STARTED,
        CUSTOM_ENTITY_SAVE,
        saveCustomEntityMutation,
        !get(record, 'id', false) ? 'Entity added.' : 'Entity updated.'
    )({ record });

export const loadCustomEntityChildren = (id: string) =>
    loadData(LOAD_CUSTOM_ENTITY_CHILDREN_STARTED, LOAD_CUSTOM_ENTITY_CHILDREN, customEntitiesChildrenQuery)({ id, filterBy: [{ field: 'parent.id', op: '=', value: id }] });

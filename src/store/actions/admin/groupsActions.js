/* @flow */


import history from 'store/History';
import { graphql } from 'graphql/client';
import { dispatchError, loadData, loadTableData, mutateData } from 'app/utils/redux/action-utils';
import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import { getUnique } from 'app/utils/array/array-utils';

import { loadUserProfile } from './usersActions';
import groupDetailQuery from 'graphql/groups/groupDetailQuery';
import updateGroupMutation from 'graphql/groups/updateGroupMutation';
import updatePermissionsMutation from 'graphql/groups/updatePermissionsMutation';
import addEntitiesToGroupMutation from 'graphql/groups/addEntitiesToGroupMutation';
import createGroupMutation from 'graphql/groups/createGroupMutation';
import addUsersToGroupMutation from 'graphql/groups/addUsersToGroupMutation';
import deleteGroupUserMutation from 'graphql/groups/deleteGroupUserMutation';
import deleteGroupEntityMutation from 'graphql/groups/deleteGroupEntityMutation';
import groupAutocompleteQuery from 'graphql/groups/groupAutocompleteQuery';
import groupUsersAddQuery from 'graphql/groups/groupUsersAddQuery';
import groupsQuery from 'graphql/groups/groupsQuery';
import groupEntitiesClassificationsQuery from 'graphql/groups/groupEntitiesClassificationsQuery';
import groupPermissionsQuery from 'graphql/groups/groupPermissionsQuery';
import groupUsersQuery from 'graphql/groups/groupUsersQuery';
import groupClassQuery from 'graphql/groups/groupClassQuery';
import groupThingsQuery from 'graphql/groups/groupThingsQuery';
import groupCustomEntitiesQuery from 'graphql/groups/groupCustomEntitiesQuery';
import groupOrganisationsQuery from 'graphql/groups/groupOrganisationsQuery';
import groupProcessDefinitionEntityQuery from 'graphql/groups/groupProcessDefinitionEntityQuery';
import groupPeopleQuery from 'graphql/groups/groupPeopleQuery';
import groupEntitiesAddQueryBuilder from 'graphql/groups/groupEntitiesAddQueryBuilder';
import groupChangelogQuery from 'graphql/groups/groupChangelogQuery';
import deleteGroupMutation from 'graphql/groups/deleteGroupMutation';


export const SELECTED_CLASSES = '@@affectli/admin/groups/group/SELECTED_CLASSES';
export const SELECTED_ENTITIES = '@@affectli/admin/groups/group/SELECTED_ENTITIES';

export const LOAD_GROUPS_STARTED = '@@affectli/admin/groups/LOAD_GROUPS_STARTED';
export const LOAD_GROUPS = '@@affectli/admin/groups/LOAD_GROUPS';

export const LOAD_GROUP_STARTED = '@@affectli/admin/groups/LOAD_GROUP_STARTED';
export const LOAD_GROUP = '@@affectli/admin/groups/LOAD_GROUP';
export const LOAD_GROUP_FINISHED = '@@affectli/admin/groups/LOAD_GROUP_FINISHED';

export const LOAD_AVAILABLE_PERMISSIONS_STARTED = '@@affectli/admin/groups/LOAD_AVAILABLE_PERMISSIONS_STARTED';
export const LOAD_AVAILABLE_PERMISSIONS = '@@affectli/admin/groups/LOAD_AVAILABLE_PERMISSIONS';

export const LOAD_GROUP_USERS_ADD_LIST_STARTED = '@@affectli/admin/groups/LOAD_GROUP_USERS_ADD_LIST_STARTED';
export const LOAD_GROUP_USERS_ADD_LIST = '@@affectli/admin/groups/LOAD_GROUP_USERS_ADD_LIST';

export const UPDATE_GROUP_STARTED = '@@affectli/admin/groups/UPDATE_GROUP_STARTED';
export const UPDATE_GROUP = '@@affectli/admin/groups/UPDATE_GROUP';

export const CREATE_GROUP_STARTED = '@@affectli/admin/groups/CREATE_GROUP_STARTED';
export const CREATE_GROUP = '@@affectli/admin/groups/CREATE_GROUP';

export const DELETE_GROUP_STARTED = '@@affectli/admin/groups/DELETE_GROUP_STARTED';
export const DELETE_GROUP = '@@affectli/admin/groups/DELETE_GROUP';

export const LOAD_GROUP_USERS_STARTED = '@@affectli/admin/groups/LOAD_GROUP_USERS_STARTED';
export const LOAD_GROUP_USERS = '@@affectli/admin/groups/LOAD_GROUP_USERS';

export const ADD_GROUP_USERS_STARTED = '@@affectli/admin/groups/ADD_GROUP_USERS_STARTED';
export const ADD_GROUP_USERS = '@@affectli/admin/groups/ADD_GROUP_USERS';

export const ADD_ENTITIES_TO_GROUP_STARTED = '@@affectli/admin/groups/ADD_ENTITIES_TO_GROUP_STARTED';
export const ADD_ENTITIES_TO_GROUP = '@@affectli/admin/groups/ADD_ENTITIES_TO_GROUP';

export const REMOVE_GROUP_USERS_STARTED = '@@affectli/admin/groups/REMOVE_GROUP_USERS_STARTED';
export const REMOVE_GROUP_USERS = '@@affectli/admin/groups/REMOVE_GROUP_USERS';

export const UPDATE_PERMISSIONS_STARTED = '@@affectli/admin/groups/UPDATE_PERMISSIONS_STARTED';
export const UPDATE_PERMISSIONS = '@@affectli/admin/groups/UPDATE_PERMISSIONS';

export const REMOVE_GROUP_ENTITIES_STARTED = '@@affectli/admin/groups/REMOVE_GROUP_ENTITIES_STARTED';
export const REMOVE_GROUP_ENTITIES = '@@affectli/admin/groups/REMOVE_GROUP_ENTITIES';

export const LOAD_GROUP_CLASSES_STARTED = '@@affectli/admin/groups/LOAD_GROUP_CLASSES_STARTED';
export const LOAD_GROUP_CLASSES = '@@affectli/admin/groups/LOAD_GROUP_CLASSES';

export const LOAD_GROUP_ENTITIES_STARTED = '@@affectli/admin/groups/LOAD_GROUP_ENTITIES_STARTED';
export const LOAD_GROUP_ENTITIES = '@@affectli/admin/groups/LOAD_GROUP_ENTITIES';

export const LOAD_GROUP_THINGS_STARTED = '@@affectli/admin/groups/LOAD_GROUP_THINGS_STARTED';
export const LOAD_GROUP_THINGS = '@@affectli/admin/groups/LOAD_GROUP_THINGS';

export const LOAD_GROUP_PEOPLE_STARTED = '@@affectli/admin/groups/LOAD_GROUP_PEOPLE_STARTED';
export const LOAD_GROUP_PEOPLE = '@@affectli/admin/groups/LOAD_GROUP_PEOPLE';

export const LOAD_GROUP_ORGANISATION_STARTED = '@@affectli/admin/groups/LOAD_GROUP_ORGANISATION_STARTED';
export const LOAD_GROUP_ORGANISATION = '@@affectli/admin/groups/LOAD_GROUP_ORGANISATION';

export const LOAD_GROUP_CUSTOM_STARTED = '@@affectli/admin/groups/LOAD_GROUP_CUSTOM_STARTED';
export const LOAD_GROUP_CUSTOM = '@@affectli/admin/groups/LOAD_GROUP_CUSTOM';

export const LOAD_GROUP_PROCESS_DEFINITIONS_STARTED = '@@affectli/admin/groups/LOAD_GROUP_PROCESS_DEFINITIONS_STARTED';
export const LOAD_GROUP_PROCESS_DEFINITIONS = '@@affectli/admin/groups/LOAD_GROUP_PROCESS_DEFINITIONS';

export const LOAD_GROUP_CLASSIFICATION_DEFINITION_STARTED = '@@affectli/admin/groups/LOAD_GROUP_CLASSIFICATION_DEFINITION_STARTED';
export const LOAD_GROUP_CLASSIFICATION_DEFINITION = '@@affectli/admin/groups/LOAD_GROUP_CLASSIFICATION_DEFINITION';

export const LOAD_GROUP_AUTOCOMPLETE_STARTED = '@@affectli/admin/groups/LOAD_GROUP_AUTOCOMPLETE_STARTED';
export const LOAD_GROUP_AUTOCOMPLETE = '@@affectli/admin/groups/LOAD_GROUP_AUTOCOMPLETE';

export const LOAD_GROUP_CHANGELOG_STARTED = '@@affectli/admin/groups/LOAD_GROUP_CHANGELOG_STARTED';
export const LOAD_GROUP_CHANGELOG = '@@affectli/admin/groups/LOAD_GROUP_CHANGELOG';

/**
 * Loads the suggestions for the person autocomplete component.
 */
export const loadGroupAutocomplete = loadData(
    LOAD_GROUP_AUTOCOMPLETE_STARTED,
    LOAD_GROUP_AUTOCOMPLETE,
    groupAutocompleteQuery,
);

/**
 * Set the selected Group's classes in the Redux's state.
 *
 * @param selectedClasses the selected classes.
 */
export const selectClasses = (selectedClasses: Object[] = []) => (dispatch: Function, getState: Function) => {
    dispatch({ type: SELECTED_CLASSES, payload: Immutable(selectedClasses) });
};

/**
 * Set the selected Group's entities in the Redux's state.
 *
 * @param selectedEntities the selected entities.
 */
export const selectEntities = (selectedEntities: Object[] = []) => (dispatch: Function, getState: Function) => {
    dispatch({ type: SELECTED_ENTITIES, payload: Immutable(selectedEntities) });
};

/**
 * Load classifications for grid header
 *
 * @param options
 * @param page
 * @param pageSize the query's options
 * @param orderBy
 * @param where
 */
export const loadGroups = (options: Object) => (dispatch: Function) => {
    dispatch({ type: LOAD_GROUPS_STARTED });
    return graphql.query({
        query: groupsQuery,
        variables: options,
        fetchPolicy: 'no-cache'
    }).then((response) => {
        const { records } = Immutable(get(response, 'data') || {});
        dispatch({ type: LOAD_GROUPS, payload: Immutable(get(response, 'data')) });
        return { records };
    }).catch((error) => {
        dispatch({ type: LOAD_GROUPS, payload: error, error: true });
    });
};

/**
 * Loads a Group.
 *
 */
export const loadGroup = (id: Number) =>
    loadData(LOAD_GROUP_STARTED, LOAD_GROUP, groupDetailQuery)({ id });

/**
 * load users list to add in any group
 */
export const groupUsersAddList = (groupId: string, isAdmin: boolean = false, options: Object) => {
    options.excludeBy = { field: 'userGroups.group.id', op: '=', value: groupId };
    if (!isAdmin) {
        options.where.push({ field: 'active', op: '=', value: true });
    }
    return loadTableData(LOAD_GROUP_USERS_ADD_LIST_STARTED, LOAD_GROUP_USERS_ADD_LIST, groupUsersAddQuery)(options);
};

/**
 * Loads the available permissions that can be assigned to a Group.
 * @param variables options for query
 */
export const loadAvailablePermissions = () => (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_AVAILABLE_PERMISSIONS_STARTED });
    graphql.query({
        query: groupPermissionsQuery,
        variables: { where: [{ field: 'type', op: '=', value: 1 }] },
        fetchPolicy: 'no-cache',
    }).then((response) => {
        dispatch({ type: LOAD_AVAILABLE_PERMISSIONS, payload: Immutable(get(response, 'data')) });
    }).catch((error) => {
        dispatch({ type: LOAD_AVAILABLE_PERMISSIONS, payload: error, error: true });
    });
};

export const createGroup = (record: Object) => (dispatch: Function, getState: Function) => {
    mutateData(
        CREATE_GROUP_STARTED,
        CREATE_GROUP,
        createGroupMutation,
        'Group added.',
    )({ record })(dispatch, getState).then(({ id }) => {
        if (id) {
            history.push(`/groups/${id}/`);
        }
    });
};

export const updateGroupDetails = ({
    id,
    category,
    name,
    active,
    parentId,
    parent,
    classificationUris,
    classifications,
    attributes,
}: Object) => {
    const record = {
        id,
        category,
        name,
        active,
        parentId,
        parent: get(parent, 'id') ? { id: get(parent, 'id') } : null,
        classificationUris,
        classifications: get(classifications, '[0].uri') ? [{ uri: get(classifications, '[0].uri') }] : null, // If no classification selected then we need to pass null instead of empty array, otherwise GQL will throw an error
        attributes,
    };
    return updateGroup(record);

};


/**
 * This function will update permissions of the group
 * https://gitlab.mi-c3.com/affectli-project/affectli-support-issues/issues/8223
 */
export const updateGroupPermissions = ({
    id,
    permissions,
}: Object) => {

    const record = {
        id,
        permissions: permissions && permissions.length ? getUnique(permissions) : null, // If no permission selected then we need to pass null instead of empty array, otherwise GQL will throw an error,
    };
    return updateGroup(record);

};

const updateGroup = (record: Object) =>  (dispatch: Function, getState: Function) => {
    dispatch({ type: LOAD_GROUP_STARTED });
    return mutateData(
        UPDATE_GROUP_STARTED,
        UPDATE_GROUP,
        updateGroupMutation,
        'Group updated.',
    )({ record })(dispatch, getState).then((group) => {
        if (!(group instanceof Error)) {
            dispatch({ type: LOAD_GROUP, payload: { group } });
            dispatch(loadUserProfile());
        } else {
            dispatch({ type: LOAD_GROUP_FINISHED });
        }
    });
};
/**
 * Deletes a Group.
 *
 * @param id the  id of the group.
 */
export const deleteGroup = (id: number) =>  mutateData(
    DELETE_GROUP_STARTED,
    DELETE_GROUP,
    deleteGroupMutation,
    'Group Deleted'
)({ id });

/**
 * Load the users associated with the specified group
 *
 * @param groupId group id (required)
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 * @param isAdmin if current user is admin boolean default false
 * @returns {*}
 */
export const loadGroupUsers = (groupId: string, options: Object, isAdmin: boolean = false) => {
    const opt = { ...options };
    opt.where = [...(opt.where || []), { field: 'group.id', op: '=', value: groupId }];
    if (!isAdmin) {
        opt.where.push({ field: 'user.active', op: '=', value: true });
    }
    return loadTableData(LOAD_GROUP_USERS_STARTED, LOAD_GROUP_USERS, groupUsersQuery)(opt);
};

/**
 * Adds a list of users to the Group.
 *
 * @param groupId {number} the ID of the Group.
 * @param userIds {string[]} the IDs of the users to add to the group.
 *
 * @returns {function(Function, Function)} the function to dispatch the action.
 */
export const addUsersToGroup = ({ groupId, userIds }: Object) =>
    mutateData(
        ADD_GROUP_USERS_STARTED,
        ADD_GROUP_USERS,
        addUsersToGroupMutation,
        `${userIds.length} users added.`,
    )({ groupId, userIds });

/**
 * Removes the specified users from the specified group.
 *
 * @param id the group user id
 * @param userId the id of removed user
 * @returns {function(Function, Function): *} the function to dispatch the action.
 */
export const removeGroupUser = (id: string, userId: number) => (dispatch: Function, getState: Function) =>
    mutateData(
        REMOVE_GROUP_USERS_STARTED,
        REMOVE_GROUP_USERS,
        deleteGroupUserMutation,
        'User removed..',
    )({ id: Number(id) })(dispatch, getState)
        .then((mbError) => {
            // if non-admin user removes himself from the group we need to reload his profile and redirect to main page
            if (!(mbError instanceof Error) && userId === getState().user.profile.id && !getState().user.profile.isAdmin) {
                dispatch(loadUserProfile());
                history.push('/');
            }
        });



/**
 * Updates the group's permissions of the specified entities.
 */
export const updatePermissions = ({ groupId, groupEntityIds, permissions }: Object) => mutateData(
    UPDATE_PERMISSIONS_STARTED,
    UPDATE_PERMISSIONS,
    updatePermissionsMutation,
    'Permissions Updated',
)({ groupId, groupEntityIds, permissions });

/**
 * Adds the specified Entities to the specified Group.
 */
export const addEntitiesToGroup = (groupId: string, entityType: string, selectedEntities: Array<Object> = []) => {
    // for classificatios the uid is the uri, for all the other entities the uid is the id
    const entities = selectedEntities.map(({ id, uri }) => ({ uid: String(uri || id), entityType }));
    return mutateData(
        ADD_ENTITIES_TO_GROUP_STARTED,
        ADD_ENTITIES_TO_GROUP,
        addEntitiesToGroupMutation,
        `Entity(ies) added. ${entityType !== 'proc_def' ? 'Note: This group\'s permissions will apply to any existing children or future children of these entity(ies).' : ''}`,
    )({ groupId, entities });
};

/**
 * Loads available entities list that can be added to group .
 */
export const loadAvailableEntities = (
    groupId: string,
    entityType: string,
    isAdmin: boolean = false,
    options: Object,
) => {

    const entity = {
        thing: 'things',
        person: 'people',
        organisation: 'organisations',
        custom: 'customEntities',
        proc_def: 'processDefinitionEntities',
    }[entityType];

    const countType = {
        thing: 'thing',
        person: 'person',
        organisation: 'organisation',
        custom: 'customEntity',
        proc_def: 'processDefinitionEntity',
    }[entityType];

    if (entityType !== 'proc_def' && !isAdmin) {
        options.where.push({ field: 'active', op: '=', value: true });
    }

    return loadTableData(
        LOAD_GROUP_ENTITIES_STARTED,
        LOAD_GROUP_ENTITIES,
        groupEntitiesAddQueryBuilder({ entity, countType }),
    )({ ...options, excludeBy: [{ field: 'entityGroups.group.id', op: '=', value: groupId }] });
};

/**
 * Removes the specified Entities from the specified Group.
 */
export const removeGroupEntity = (id: string, entityType: string = '') =>
    mutateData(
        REMOVE_GROUP_ENTITIES_STARTED,
        REMOVE_GROUP_ENTITIES,
        deleteGroupEntityMutation,
        entityType === 'classification' ? 'Classfication removed' : 'Entity removed',
    )({ id: Number(id) });

/**
 * Get the Classes related to the Group.
 *
 * @param groupId the id of the Group (required)
 * @param options the query's options
 * @param isAdmin if user is admin boolean
 * @returns {*}
 */
export const loadGroupClasses = (groupId: number, options: Object, isAdmin: boolean = false) => {
    const filterByGroup = [
        { field: 'group.id', op: '=', value: groupId },
        { field: 'classification.id', op: 'is not null' },
    ];
    if (!isAdmin) {
        filterByGroup.push({ field: 'classification.active', op: '=', value: true });
    }
    if (options.where) {
        options.where = [...options.where, ...filterByGroup];
    } else {
        options.where = [...filterByGroup];
    }
    return loadTableData(LOAD_GROUP_CLASSES_STARTED, LOAD_GROUP_CLASSES, groupEntitiesClassificationsQuery)(options);
};

const loadGroupProcessDefinitions = (options: Object) => {
    return loadTableData(
        LOAD_GROUP_PROCESS_DEFINITIONS_STARTED,
        LOAD_GROUP_PROCESS_DEFINITIONS,
        groupProcessDefinitionEntityQuery,
    )(
        options);
};

const loadGroupCustomEntities = (options: Object) => {
    return loadTableData(LOAD_GROUP_CUSTOM_STARTED, LOAD_GROUP_CUSTOM, groupCustomEntitiesQuery)(options);
};

const loadGroupOrganisations = (options: Object) => {
    return loadTableData(LOAD_GROUP_ORGANISATION_STARTED, LOAD_GROUP_ORGANISATION, groupOrganisationsQuery)(options);
};

const loadGroupThings = (options: Object) => {
    return loadTableData(LOAD_GROUP_THINGS_STARTED, LOAD_GROUP_THINGS, groupThingsQuery)(options);
};

const loadGroupPeople = (options: Object) => {
    return loadTableData(LOAD_GROUP_PEOPLE_STARTED, LOAD_GROUP_PEOPLE, groupPeopleQuery)(options);
};

/**
 * Get all the Entities related with a group.
 *
 * @param groupId the id of the Group (required).
 * @param entityType type of entity (thing, custom, processDef etc.)
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 * @param isAdmin boolean if user is admin
 * @returns {*}
 */
export const loadGroupEntities = (groupId: string, entityType: string, options: Object, isAdmin: boolean = false) => {
    const opt = { ...options };

    opt.where = [
        ...(opt.where || []),
        { field: 'group.id', op: '=', value: groupId },

    ];
    const activeField = {
        thing: 'thing.active',
        person: 'person.active',
        organisation: 'organisation.active',
        custom: 'customEntity.active',
    };
    const idField = {
        thing: 'thing.id',
        person: 'person.id',
        organisation: 'organisation.id',
        custom: 'customEntity.id',
        proc_def: 'processDefinitionEntity.id',
    };
    if (idField[entityType]) {
        opt.where.push({ field: idField[entityType], op: 'is not null' });
    }
    if (entityType && !isAdmin && activeField[entityType]) {
        opt.where.push({ field: activeField[entityType], op: '=', value: true });
    }
    switch (entityType) {
        case 'thing':
            return loadGroupThings(opt);
        case 'person':
            return loadGroupPeople(opt);
        case 'organisation':
            return loadGroupOrganisations(opt);
        case 'custom':
            return loadGroupCustomEntities(opt);
        case 'proc_def':
            return loadGroupProcessDefinitions(opt);
        default:
            return null;
    }
};

const _loadGroupClassByUri = (uri: ?string, filterBy: ?Array<Object> = []): Promise<?Object> => {
    if (!uri) {
        return Promise.resolve(null);
    }
    const queryOptions = { filterBy: [...(filterBy || []), { field: 'uri', op: '=', value: uri }] };
    return graphql.query({
        query: groupClassQuery,
        variables: queryOptions,
        fetchPolicy: 'no-cache',
    }).then((response: Object): void => {
        return Immutable(get(response, 'data.result') || []).map((record) => {
            const fields = (record.formDefinitions || {}).fields || [];
            // get the fields' groups names removing the duplicates
            const fieldGroupsNames = Array.from(new Set(fields.map(({ group_name }) => group_name || 'Ungrouped')));
            return {
                ...record,
                groups: fieldGroupsNames.map(name => ({
                    name: name,
                    fields: fields.filter(({ group_name }) => (group_name || 'Ungrouped') === name),
                })),
            };
        });
    });
};

/**
 * Load the group's classification definition.
 */

export const loadGroupClassificationDefinition = (uri: string) => (
    dispatch: Function,
    getState: Function,
): Promise<?Object | Error> => {
    dispatch({ type: LOAD_GROUP_CLASSIFICATION_DEFINITION_STARTED });
    return _loadGroupClassByUri(uri).then((data: ?Object) => {
        dispatch({ type: LOAD_GROUP_CLASSIFICATION_DEFINITION, payload: Immutable(data) });
        return Immutable(data);
    }).catch(dispatchError(dispatch, LOAD_GROUP_CLASSIFICATION_DEFINITION));
};


/**
 * Fetch the group changelog.
 *
 * @param id the entity ID.
 */
export const loadGroupChangelog = (id: number, options: Object) => (dispatch: Function) => {
    dispatch({ type: LOAD_GROUP_CHANGELOG_STARTED });
    return graphql.query({
        query: groupChangelogQuery,
        variables: { id, uid: String(id), ...options },
        fetchPolicy: 'no-cache',
    }).then((response: Object): void => {
        const payload = {
            changes: get(response, 'data.group.changelog'),
            startIndex: options.startIndex,
            count: get(response, 'data.count'),
        };
        dispatch({ type: LOAD_GROUP_CHANGELOG, payload });
    }).catch((error) => {
        dispatch({ type: LOAD_GROUP_CHANGELOG, payload: error, error: true });
    });
};

/* @flow */

import Immutable from 'app/utils/immutable/Immutable';
import { loadDataReducer, truthful } from 'app/utils/redux/reducer-utils';
import { ATTACH_FILE_STARTED, ATTACH_FILE, DELETE_ATTACHMENT_STARTED, DELETE_ATTACHMENT } from 'store/actions/common/attachmentsActions';
import {
    ADD_ENTITY_CLASS_STARTED,
    ADD_ENTITY_CLASS,
    REMOVE_ENTITY_CLASS_STARTED,
    REMOVE_ENTITY_CLASS,
    LOAD_ENTITY_CHANGELOG_STARTED,
    LOAD_ENTITY_CHANGELOG,
    GET_ENTITY_TYPE_STARTED,
    GET_ENTITY_TYPE
} from 'store/actions/entities/entitiesActions';

const changelogReducer = loadDataReducer(LOAD_ENTITY_CHANGELOG_STARTED, LOAD_ENTITY_CHANGELOG, truthful);
const getEntityTypeReducer = loadDataReducer(GET_ENTITY_TYPE_STARTED, GET_ENTITY_TYPE, truthful);

/**
 * Generic Entity reducer.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (
    state: Object = Immutable({
        attachFileInProgress: false,
        deletingAttachments: false,
        addingClass: false,
        removingClass: false,
        expandedEntities: { isLoading: false, list: [], total: 0 },
        changelog: { isLoading: false },
        entityType: { isLoading: false }
    }),
    action: Object,
    meta: Object = {}
): Object => {
    const { type } = action;
    switch (type) {
        case ATTACH_FILE_STARTED:
            return Immutable({ ...state, attachFileInProgress: true });

        case ATTACH_FILE:
            return Immutable({ ...state, attachFileInProgress: false });

        case DELETE_ATTACHMENT_STARTED:
            return Immutable({ ...state, deletingAttachments: true });

        case DELETE_ATTACHMENT:
            return Immutable({ ...state, deletingAttachments: false });

        case ADD_ENTITY_CLASS_STARTED:
            return Immutable({ ...state, addingClass: true });

        case ADD_ENTITY_CLASS:
            return Immutable({ ...state, addingClass: false });

        case REMOVE_ENTITY_CLASS_STARTED:
            return Immutable({ ...state, removingClass: true });

        case REMOVE_ENTITY_CLASS:
            return Immutable({ ...state, removingClass: false });

        case LOAD_ENTITY_CHANGELOG_STARTED:
        case LOAD_ENTITY_CHANGELOG:
            return Immutable({ ...state, changelog: changelogReducer(state.changelog, action, meta) });

        case GET_ENTITY_TYPE_STARTED:
        case GET_ENTITY_TYPE:
            return Immutable({ ...state, entityType: getEntityTypeReducer(state.entityType, action) });

        default:
            return state;
    }
};

export default reducer;

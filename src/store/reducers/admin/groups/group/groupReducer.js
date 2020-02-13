/* @flow */

import {
    LOAD_GROUP_STARTED,
    LOAD_GROUP_FINISHED,
    LOAD_GROUP,
    LOAD_AVAILABLE_PERMISSIONS_STARTED,
    LOAD_AVAILABLE_PERMISSIONS,
    LOAD_GROUP_CLASSES_STARTED,
    LOAD_GROUP_CLASSES,
    SELECTED_CLASSES,
    SELECTED_ENTITIES,
    LOAD_GROUP_CLASSIFICATION_DEFINITION_STARTED,
    LOAD_GROUP_CLASSIFICATION_DEFINITION,
} from 'store/actions/admin/groupsActions';
import Immutable from 'app/utils/immutable/Immutable';
import { dataTableReducer } from 'app/utils/redux/reducer-utils';


/**
 * Group reducer.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (
    state: Object = Immutable({
        availablePermissions: [],
        classes: {},
        selectedItems: [],
        entities: [],
        selectedEntities: [],
        selectedClasses: [],
        isLoading: false,
        groups: [],
        details: null,
        entityLoading: true,
        classifications: [],
        classificationDefinition: { isLoading: false },
    }),
    { type, payload, error, meta }: Object,
) => {
    switch (type) {
        case LOAD_GROUP_STARTED:
            return Immutable({ ...state, isLoading: true });

        case LOAD_GROUP:
            return Immutable({ ...state, isLoading: false,  details: payload.group });

        case LOAD_GROUP_FINISHED:
            return Immutable({ ...state, isLoading: false });

        case LOAD_AVAILABLE_PERMISSIONS_STARTED:
            return Immutable({ ...state, isLoading: true });

        case LOAD_AVAILABLE_PERMISSIONS: {
            if (error) return Immutable({ ...state, isLoading: false });
            const { records } = payload;
            return Immutable({ ...state, availablePermissions: records || [], isLoading: false });
        }

        case SELECTED_CLASSES:
            return Immutable({ ...state, selectedClasses: payload });

        case SELECTED_ENTITIES:
            return Immutable({ ...state, selectedEntities: payload });

        case LOAD_GROUP_CLASSES_STARTED: case LOAD_GROUP_CLASSES:
            return Immutable({
                ...state,
                classes: dataTableReducer(LOAD_GROUP_CLASSES_STARTED, LOAD_GROUP_CLASSES)(state.classes, { type, payload, error, meta })
            });

        case LOAD_GROUP_CLASSIFICATION_DEFINITION_STARTED:
            return Immutable({ ...state, classificationDefinition: { isLoading: true } });

        case LOAD_GROUP_CLASSIFICATION_DEFINITION:
            if (error) {
                return Immutable({ ...state, classificationDefinition: { isLoading: false } });
            }
            return Immutable({ ...state, classificationDefinition: { isLoading: false, definition: payload && payload[0] } });

        default:
            return state;
    }
};

export default reducer;

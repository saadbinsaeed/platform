/* @flow */

import {
    LOAD_CUSTOM_ENTITY_CHILDREN_STARTED,
    LOAD_CUSTOM_ENTITY_CHILDREN,
} from 'store/actions/entities/customEntitiesActions';
import Immutable from 'app/utils/immutable/Immutable';

/**
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
export default (state: Object = Immutable({
    isLoading: false,
    data: [],
}), action: Object) => {

    switch ( action.type ) {
        case LOAD_CUSTOM_ENTITY_CHILDREN_STARTED:
            return Immutable({ ...state, isLoading: true });

        case LOAD_CUSTOM_ENTITY_CHILDREN:{
            if (action.error) {
                return Immutable({ ...state, isLoading: false });
            }
            return Immutable({ ...state, data: action.payload, isLoading: false });
        }

        default:
            return state;
    }
};

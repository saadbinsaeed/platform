// @flow
import {
    LOAD_APPS,
    LOAD_APPS_STARTED,
    LOAD_APPS_FAVORITES_STARTED,
    LOAD_APPS_FAVORITES,
    SAVE_APPS_FAVORITES,
} from 'store/actions/abox/myAppsActions';
import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';

const initialState = {
    records: [],
    favorites: {},
    isLoading: false,
    isFavoritesLoading: false,
};
/**
 * Reducer to handle app actions
 * @param state
 * @param action
 * @returns {*}
 */
export default (state: Object = initialState, action: Function) => {
    const { type, error, payload } = action;
    switch (type) {
        case LOAD_APPS_STARTED:
            return Immutable({ ...state, isLoading: true });

        case LOAD_APPS: {
            if (error) return Immutable({ ...state, isLoading: false });
            return Immutable({
                ...state,
                isLoading: false,
                records: payload
            });
        }

        case LOAD_APPS_FAVORITES_STARTED:
            return Immutable({ ...state, isFavoritesLoading: true });

        case LOAD_APPS_FAVORITES: {
            if (error) return Immutable({ ...state, isFavoritesLoading: false });
            return Immutable({
                ...state,
                isFavoritesLoading: false,
                favorites: get(payload, 'myApp', {}),
            });
        }

        case SAVE_APPS_FAVORITES: {
            if (error) return Immutable({ ...state });
            return Immutable({
                ...state,
                favorites: get(payload, 'myApp', {}),
            });
        }
        default:
            return state;
    }
};

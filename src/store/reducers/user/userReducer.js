/* @flow */

import {
    LOAD_USER_PREFERENCES_STARTED,
    LOAD_USER_PREFERENCES,
    SAVE_USER_PREFERENCES,
    SAVE_DATA_TABLE_PREFERENCES,
    RESET_DATA_TABLE_PREFERENCES,
    LOAD_USER_PROFILE_STARTED,
    LOAD_USER_PROFILE,
} from 'store/actions/admin/usersActions';
import Immutable from 'app/utils/immutable/Immutable';


/**
 * User Preferences reducer.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (state: Object = Immutable({
    loadingPreferences: false,
    preferences: null,
    loadingProfile: false,
    profile: null,
}), action: Object) => {

    const { type, payload } = action || {};

    switch ( type ) {
        case LOAD_USER_PREFERENCES_STARTED:
            return Immutable({ ...state, loadingPreferences: true });

        case LOAD_USER_PREFERENCES:
            return Immutable({ ...state, preferences: payload || {}, loadingPreferences: false });

        case SAVE_USER_PREFERENCES: case SAVE_DATA_TABLE_PREFERENCES: case RESET_DATA_TABLE_PREFERENCES:
            return Immutable({ ...state, preferences: payload });

        case LOAD_USER_PROFILE_STARTED:
            return Immutable({ ...state, loadingProfile: true });

        case LOAD_USER_PROFILE: {
            const profile = payload && payload.login ? payload : { invalid: true };
            return Immutable({ ...state, profile, loadingProfile: false });
        }
        default:
            return state;
    }
};

export default reducer;

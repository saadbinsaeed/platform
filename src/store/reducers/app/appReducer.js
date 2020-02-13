/* @flow */
import Immutable from 'app/utils/immutable/Immutable';
import {
    TOGGLE_NAV,
    OPEN_NAV,
    TOGGLE_NOTIFICATIONS,
    TOGGLE_CHAT,
    TOGGLE_SEARCH,
    SELECT_THEME,
    SET_HEADERS,
    LOAD_APP_ORGANISATION_STARTED,
    LOAD_APP_ORGANISATION,
    SHOW_TOASTR,
    ERROR_ALERT_MESSAGE,
    TOGGLE_APP_HEADERS,
    HIDE_STEPPER_SAVE_BUTTON,
    SHOW_STEPPER_SAVE_BUTTON

} from 'store/actions/app/appActions';

const initialState = {
    isNavOpen: false,
    isNotificationsOpen: false,
    isChatOpen: false,
    isSearchOpen: false,
    isHeaderDisabled: false,
    headers: {
        title: '',
        subTitle: '',
        headerInfo: [],
        pillText: '',
        actions: '',
        menuItems: '',
        color: {
            background: '',
        },
    },
    theme: 'light',
    listAs: 'cards',
    organisation: {
        name: null,
        image: null,
    },
    toastrOptions: {},
    errorOptions: {},
    stepper: {
        hideOnSave: false,
    }
};
/**
 * Reducer to handle app actions
 * @param state
 * @param action
 * @returns {*}
 */
export default (state: Object = initialState, action: Object) => {
    const { type, payload, error } = action;
    switch (type) {
        case TOGGLE_NAV:
            return {
                ...state,
                isNavOpen: !state.isNavOpen,
            };
        case OPEN_NAV:
            return {
                ...state,
                isNavOpen: true,
            };
        case TOGGLE_NOTIFICATIONS:
            return {
                ...state,
                isNotificationsOpen: !state.isNotificationsOpen,
            };
        case TOGGLE_CHAT:
            return {
                ...state,
                isChatOpen: !state.isChatOpen,
            };
        case TOGGLE_SEARCH:
            return {
                ...state,
                isSearchOpen: !state.isSearchOpen,
            };
        case SELECT_THEME:
            return {
                ...state,
                theme: action.theme,
            };
        case SET_HEADERS:
            // console.log('headersReducer', action);
            return Immutable({ ...state, headers: payload });

        case LOAD_APP_ORGANISATION_STARTED:
            return Immutable({ ...state, isLoading: true });

        case LOAD_APP_ORGANISATION: {
            if (error || !payload) return Immutable({ ...state, isLoading: false });
            return Immutable({ ...state, isLoading: false, organisation: payload });
        }
        case SHOW_TOASTR: {
            return Immutable({ ...state, toastrOptions: payload });
        }
        case ERROR_ALERT_MESSAGE: {
            return Immutable({ ...state, errorOptions: payload });
        }
        case TOGGLE_APP_HEADERS: {
            return Immutable({ ...state, isHeaderDisabled: payload });
        }
        case HIDE_STEPPER_SAVE_BUTTON: {
            return Immutable({ ...state, stepper: { ...state.stepper, hideOnSave: true } });
        }
        case SHOW_STEPPER_SAVE_BUTTON: {
            return Immutable({ ...state, stepper: { ...state.stepper, hideOnSave: false } });
        }
        default:
            return state;
    }
};

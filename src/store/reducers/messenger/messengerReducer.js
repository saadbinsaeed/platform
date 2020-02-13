/* @flow */

import Immutable from 'app/utils/immutable/Immutable';
import {
    TOGGLE_MESSENGER,
    LOAD_MESSENGER_STARTED, LOAD_MESSENGER,
    LOAD_MESSENGER_PROCESS_MESSAGES, LOAD_MESSENGER_PROCESS_MESSAGES_STARTED,
    LOAD_MESSENGER_TASK_MESSAGES_STARTED, LOAD_MESSENGER_TASK_MESSAGES,
    ATTACH_FILE_MESSEGE_STARTED, ATTACH_FILE_MESSEGE
} from 'store/actions/messenger/messengerActions';

const initialState = {
    messages: {},
    showMessenger: false,
    isLoading: false,
    attachFileInProgress: false,
    selection: {
        id: null,
        type: null,
    }
};

export default (state: Object = initialState, action: Function) => {
    const { type, payload, error } = action;
    switch (type) {

        case ATTACH_FILE_MESSEGE_STARTED:
            return Immutable({ ...state, attachFileInProgress: true });

        case ATTACH_FILE_MESSEGE:
            return Immutable({ ...state, attachFileInProgress: false });

        case TOGGLE_MESSENGER :
            return Immutable({ ...state, showMessenger: !state.showMessenger });

        case LOAD_MESSENGER_STARTED :
            return Immutable({ ...state, showMessenger: true});

        case LOAD_MESSENGER :
            return Immutable({ ...state, selection: payload});

        case LOAD_MESSENGER_PROCESS_MESSAGES_STARTED :
            return Immutable({ ...state, isLoading: true });

        case LOAD_MESSENGER_PROCESS_MESSAGES: {
            if (error) return Immutable({ ...state, messages: {}, isLoading: false });
            return Immutable({ ...state, isLoading: false, messages: payload });
        }

        case LOAD_MESSENGER_TASK_MESSAGES_STARTED :
            return Immutable({ ...state, isLoading: true });

        case LOAD_MESSENGER_TASK_MESSAGES: {
            if (error) return Immutable({ ...state, messages: {}, isLoading: false });
            return Immutable({ ...state, isLoading: false, messages: payload });
        }

        default:
            return state;
    }
};

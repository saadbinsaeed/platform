import Immutable from 'app/utils/immutable/Immutable';

/**
 * Global reducer.
 *
 * @param state - the current Redux state
 * @param action - the dispatched action
 * @returns the new Redux state
 */
const reducer = (state = Immutable({ lastActionType: null, lastActionError: false, lastActionMeta: null }), action) => {

    return Immutable({
        //...state,
        lastActionType: action.type,
        lastActionError: !!action.error,
        lastActionMeta: action.meta,
        lastActionPayload: action.payload,
    });
};

export default reducer;

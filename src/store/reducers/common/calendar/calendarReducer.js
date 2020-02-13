/* @flow */

import { combineReducers } from 'redux';

import { SAVE_CALENDAR_STATE } from 'store/actions/common/calendarActions';
import Immutable, { set } from 'app/utils/immutable/Immutable';

export default combineReducers({
    state: (state: Object = Immutable({}), { type, payload }: Object) =>
        type === SAVE_CALENDAR_STATE ? set(state, payload.id, payload.state) : state,
});

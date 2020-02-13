/* @flow */
import { combineReducers } from 'redux';

import { SAVE_COMPONENT_STATE } from 'store/actions/component/componentActions';
import Immutable, { set } from 'app/utils/immutable/Immutable';

export default combineReducers({
    state: (state: Object = Immutable({}), { type, payload }: Object) =>
        type === SAVE_COMPONENT_STATE && payload.id ? set(state, payload.id, payload.state) : state,
});

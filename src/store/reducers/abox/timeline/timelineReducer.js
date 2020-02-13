/* @flow */

import Immutable from 'app/utils/immutable/Immutable';

import { SET_TIMELINE_ZOOM } from 'store/actions/abox/aboxActions';

export default (state: Object = Immutable({ range: 'weeks' }), { type, payload, error, meta }: Object) => {
    switch (type) {
        case SET_TIMELINE_ZOOM:
            return Immutable({ ...state, range: payload });
        default:
            return state;
    }
};

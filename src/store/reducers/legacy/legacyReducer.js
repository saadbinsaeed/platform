// @flow
import { RELOAD_IFRAME } from 'store/actions/legacy/legacyActions';
import Immutable from 'app/utils/immutable/Immutable';
const initialState = {
    legacyAppFormUpdate: Date.now()
};

export default (state: Object = initialState ,  action: Function) =>
{
    const { type, error } = action;
    switch(type)
    {
        case RELOAD_IFRAME: {
            if (error) return Immutable({ ...state });
            return Immutable({ ...state, legacyAppFormUpdate: Date.now() });
        }
        default:
            return state;
    }
};

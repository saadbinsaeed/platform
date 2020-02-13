/* @flow */
import Immutable from 'app/utils/immutable/Immutable';
import {
    LOAD_ROLE_STARTED,
    LOAD_ROLE_OF,
    UPDATE_USER_STARTED,
    UPDATE_USER,
    CREATE_USER_STARTED,
    CREATE_USER
} from 'store/actions/admin/userManagementAction';


export default (state: Object = Immutable({
    rolesAreLoading: false,
    availableRoles: {},
}), { type, payload, error }: Object) => {
    switch (type) {
        case UPDATE_USER_STARTED: case CREATE_USER_STARTED: return Immutable({ ...state, isLoading: true });
        case UPDATE_USER: case CREATE_USER: return Immutable({ ...state, isLoading: false });
        case LOAD_ROLE_STARTED: return Immutable({ ...state, rolesAreLoading: true });
        case LOAD_ROLE_OF:
            if (error) {
                return state;
            }
            return Immutable({
                ...state,
                rolesAreLoading: false,
                availableRoles: {
                    ...state.availableRoles,
                    [payload.employee]: (payload.data || []).map(element => ({
                        value: element.user_role,
                        label: element.user_role || 'No Result Found'
                    })),
                },
            });
        default:
    }
    return state;
};

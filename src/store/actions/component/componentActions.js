/* @flow */

import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';

export const SAVE_COMPONENT_STATE = '@@affectli/component/SAVE_COMPONENT_STATE';

/**
 * Updates the runtime state of the component with the given ID.
 *
 * @param id the component's ID.
 * @param stateUpdate the state updates.
 */
export const saveComponentState = (id: string, stateUpdate: Object) => (dispatch: Function, getState: Function) => {
    if (!id || !stateUpdate) {
        throw new Error('The component ID and the stateUpdate are required.');
    }
    const currentState = get(getState(), `component.state.${id}`) || {};
    // the next state will be a shallow merge between the current state and the state passed as parameter
    const next = {
        ...currentState,
        ...stateUpdate,
    };
    dispatch({ type: SAVE_COMPONENT_STATE, payload: Immutable({ id, state: next }) });
};

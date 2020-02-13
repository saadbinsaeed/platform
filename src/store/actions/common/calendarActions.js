/* @flow */

import Immutable from 'app/utils/immutable/Immutable';

export const SAVE_CALENDAR_STATE = '@@affectli/component/calendar/SAVE_CALENDAR_STATE';

/**
 * Save the runtime state of a Calendar.
 *
 * @param id the Calendar's ID.
 * @param status the Calendar's status.
 */
export const saveCalendarState = (id: string, state: Object) => (dispatch: Function) => {
    if (!id) {
        throw new Error('The calendar ID is required.');
    }
    dispatch({ type: SAVE_CALENDAR_STATE, payload: Immutable({ id, state }) });
};

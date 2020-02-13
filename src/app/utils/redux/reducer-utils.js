/* @flow */


import Immutable from 'app/utils/immutable/Immutable';
import { getStr } from 'app/utils/utils';

/**
 * Returns the reducer to handle the standard DataTable actions.
 *
 * @param startActionType the start action type
 * @param endActionType the end action type
 */
const dataTableReducer = (startActionType: string, endActionType: string, keepDataAtStart: Function = () => false): Function =>
    (state: Object = { records: [], count: 0, isLoading: false, isDownloading: false }, action: Object): Object => {
        const { type, payload, error, meta } = action;

        switch (type) {

            case startActionType: {
                if (meta.download) {
                    return Immutable({ ...state, isDownloading: true });
                }
                let next = { ...state, isLoading: true };
                const keepData = keepDataAtStart({ state, type, payload, error, meta });
                if (!keepData) {
                    next = { ...next, records: [], count: 0 };
                }
                return Immutable(next);
            }

            case endActionType: {
                if (error) {
                    return Immutable({ ...state, records: [], isLoading: false });
                }
                if (meta.download) {
                    return Immutable({ ...state, isDownloading: false });
                }
                const { records = [], count = 0 } = payload || {};
                return Immutable({ ...state, ...(meta || {}), isLoading: false, records, count });
            }

            default:
                return state;
        }
    };

/**
 * Returns the reducer to handle the standard DataTable actions.
 *
 * @param startActionType the start action type
 * @param endActionType the end action type
 */
const loadDataReducer = (startActionType: string, endActionType: string, keepDataAtStart: Function = () => false): Function =>
    (state: Object = { data: null, isLoading: false }, action: Object): Object => {
        const { type, payload, error, meta } = action;

        switch (type) {

            case startActionType:
                const next = { ...state, isLoading: true };
                if (!keepDataAtStart({ state, type, payload, error, meta })) {
                    next.data = null;
                }
                return Immutable(next);

            case endActionType:
                if (error) {
                    return Immutable({ ...state, error, meta, isLoading: false });
                }
                return Immutable({ ...state, isLoading: false, data: payload });

            default:
                return state;
        }
    };

/**
 * Compare new data Id and old data Id
 */
const compareId = ({ state, meta }: Object): boolean => getStr(state, 'data.id') === getStr(meta,'id');

/**
 * @return true
 */
const truthful = () => true;

export { dataTableReducer, loadDataReducer, compareId, truthful };

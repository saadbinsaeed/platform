// @flow
import HttpFetch from 'app/utils/http/HttpFetch';

export const SITUATIONAL_AWARENESS_DETAIL_STARTED: string = '@@affectli/maps/SITUATIONAL_AWARENESS_DETAIL_STARTED';
export const SITUATIONAL_AWARENESS_DETAIL: string = '@@affectli/maps/SITUATIONAL_AWARENESS_DETAIL';

export const loadSituationalAwarenessDetail = (id: number) => (dispatch: Function) => {
    dispatch({ type: SITUATIONAL_AWARENESS_DETAIL_STARTED });
    HttpFetch.getResource(`api/rpc?proc_name=icsite&id=https://affectli.dev.mi-c3.com&proc_name=thing&id=${id}`)
        .then((resp: Object): void => {
            dispatch({ type: SITUATIONAL_AWARENESS_DETAIL,
                payload: resp
            });
        })
        .catch((error: Error): void => {
            dispatch({ type: SITUATIONAL_AWARENESS_DETAIL, payload: error, error: true });
        });
};

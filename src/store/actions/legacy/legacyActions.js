// @flow
export const RELOAD_IFRAME = '@@affectli/legacy/RELOAD_IFRAME';

export const reloadIframe = () => (dispatch: Function) => {
    dispatch({ type: RELOAD_IFRAME });
};

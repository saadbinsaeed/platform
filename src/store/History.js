/* @flow */

import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import store from 'store/Store';

const hashHistory = createHashHistory();

/**
 * workaround (@see https://gitlab.mi-c3.com/affectli-project/affcetli-support-issues/issues/2036)
 * FIXME: remove the pushBack method and use the goBack method
 *        when the application will run outside of the Angular context.
 */
hashHistory.pushBack = function pushBack() {
    const historyList = store.getState().history.list;
    const historyLength = historyList.length;
    if (historyLength >= 2) {
        hashHistory.push(historyList[1].pathname);
    } else if (historyLength === 1) {
        hashHistory.goBack();
    } else {
        hashHistory.push('/abox/tasks');
    }
};

/**
 * Creates an enhanced history that syncs navigation events with the store (https://www.npmjs.com/package/react-router-redux)
 */
const history: Object = syncHistoryWithStore(hashHistory, store);

export default history;

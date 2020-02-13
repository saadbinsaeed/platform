import React from 'react';
import ReactDOM from 'react-dom';

import { MainApp } from './App';
import registerServiceWorker from './registerServiceWorker';

window.affectli.sso.onReady().then(() => { // FIXME: import and use affectliSso here
    ReactDOM.render(<MainApp />, document.getElementById('root'));
    registerServiceWorker();
});

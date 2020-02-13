/* @flow */


/**
 * Creates the Redux store
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import createRouterMiddleware from 'react-router-redux/lib/middleware';
import reduxThunk from 'redux-thunk';

import Immutable from 'app/utils/immutable/Immutable';
import affectliMiddleware from 'store/middleware/AffectliMiddleware';
import reducers from 'store/reducers/reducer';

const initialState: Object = Immutable({});

//const sagaMiddleware: Object = createSagaMiddleware();
const routerHistoryMiddleware: Object = createRouterMiddleware( createHashHistory() );

const middleware = [
    routerHistoryMiddleware,
    reduxThunk,
    affectliMiddleware,
];

let enhance = null;

// eslint-disable-next-line no-undef
// if ( __DEV__ ) {
//
//     const createLogger = require( 'redux-logger' );
//     middleware.push( createLogger( {
//         collapsed: true,
//     } ) );
//
//     const DevTools = require( '../components/dev/DevelopmentTools' ).default;
//
//     enhance = compose(
//         applyMiddleware(...middleware),
//         DevTools.instrument(),
//     );
//
// } else {

let devTool = f => f;
if (typeof window !== 'undefined') {
    devTool = window.devToolsExtension ? window.devToolsExtension() : f => f;
}

enhance = compose(
    applyMiddleware(...middleware),
    devTool
);

// }

// Create the Redux store
const store: Object = createStore(reducers, initialState, enhance);
export default store;

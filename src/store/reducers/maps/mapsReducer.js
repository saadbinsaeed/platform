// @flow
import { combineReducers } from 'redux';
// Tasks
import situationalAwareness from './situationalAwareness/situationalAwarenessReducer';
import situationalAwarenessDetail from './situationalAwarenessDetail/situationalAwarenessDetailReducer';

export default combineReducers({
    situationalAwareness,
    situationalAwarenessDetail
});

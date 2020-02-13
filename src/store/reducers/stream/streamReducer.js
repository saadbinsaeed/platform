/* @flow */

import { combineReducers } from 'redux';

import events from './events/eventsReducer';
import translationRule from './translationRuleReducer';
import { loadDataReducer } from 'app/utils/redux/reducer-utils';
import { LOAD_VTR, LOAD_VTR_STARTED } from 'store/actions/stream/eventsActions';

export default combineReducers<Object, Object>({
    events,
    vtr: loadDataReducer(LOAD_VTR_STARTED, LOAD_VTR),
    translationRule,
});

/* @flow */
import { combineReducers } from 'redux';

import { LOAD_TRANSLATION_RULE, LOAD_TRANSLATION_RULE_STARTED } from 'store/actions/stream/eventsActions';
import { loadDataReducer } from 'app/utils/redux/reducer-utils';

export default combineReducers({
    description: loadDataReducer(LOAD_TRANSLATION_RULE_STARTED, LOAD_TRANSLATION_RULE),
});

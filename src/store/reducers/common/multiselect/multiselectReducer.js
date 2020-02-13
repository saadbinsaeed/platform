/* @flow */

import { combineReducers } from 'redux';

import { LOAD_GATEWAYS_STARTED, LOAD_GATEWAYS } from 'store/actions/common/multiselectActions';
import { LOAD_TENANTS_STARTED, LOAD_TENANTS } from 'store/actions/common/multiselectActions';
import { LOAD_VENDORS_STARTED, LOAD_VENDORS } from 'store/actions/common/multiselectActions';
import { LOAD_REGIONS_STARTED, LOAD_REGIONS } from 'store/actions/common/multiselectActions';
import { loadDataReducer } from 'app/utils/redux/reducer-utils';

export default combineReducers({
    gateway: loadDataReducer(LOAD_GATEWAYS_STARTED, LOAD_GATEWAYS),
    tenant: loadDataReducer(LOAD_TENANTS_STARTED, LOAD_TENANTS),
    vendor: loadDataReducer(LOAD_VENDORS_STARTED, LOAD_VENDORS),
    region: loadDataReducer(LOAD_REGIONS_STARTED, LOAD_REGIONS),
});

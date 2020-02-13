/* @flow */

import HttpFetch from 'app/utils/http/HttpFetch';
import Immutable from 'app/utils/immutable/Immutable';
import { sortAscending } from 'app/utils/utils';
import { loadData } from 'app/utils/redux/action-utils';
import vendorsQuery from 'graphql/stream/event/vendorsQuery';
import regionsQuery from 'graphql/stream/event/regionsQuery';
import tenantsQuery from 'graphql/stream/event/tenantsQuery';

export const LOAD_GATEWAYS_STARTED: string = '@@affectli/common/multiselect/LOAD_GATEWAYS_STARTED';
export const LOAD_GATEWAYS: string = '@@affectli/common/multiselect/LOAD_GATEWAYS';

export const LOAD_TENANTS_STARTED: string = '@@affectli/common/multiselect/LOAD_TENANTS_STARTED';
export const LOAD_TENANTS: string = '@@affectli/common/multiselect/LOAD_TENANTS';

export const LOAD_VENDORS_STARTED: string = '@@affectli/common/multiselect/LOAD_VENDORS_STARTED';
export const LOAD_VENDORS: string = '@@affectli/common/multiselect/LOAD_VENDORS';

export const LOAD_REGIONS_STARTED: string = '@@affectli/common/multiselect/LOAD_REGIONS_STARTED';
export const LOAD_REGIONS: string = '@@affectli/common/multiselect/LOAD_REGIONS';

/**
* load the gateways
 */
export const loadGateways = ({ where, orderBy }: Object = {}) => {
    return (dispatch: Function/*, getState: Function*/): void => {
        dispatch({ type: LOAD_GATEWAYS_STARTED });

        HttpFetch.postResource('api/jrp/people/list',  {
            kendo: false,
            continuousScrolling: false,
            fields: [{ field: 'id' }, { field: 'display_name' }],
            where: [...(where || []), { field: 'classifications_text', op: 'contains', value: 'rms_user' }],
            orderBy,
        }).then((response) => {
            dispatch({ type: LOAD_GATEWAYS, payload: Immutable(response && sortAscending(response.data, 'display_name'))});
        }).catch((error) => {
            dispatch({ type: LOAD_GATEWAYS, payload: error, error: true });
        });
    };
};

/**
 * load the tenants
 */
export const loadTenants = ({ where = [] }: Object = {}) => loadData(LOAD_TENANTS_STARTED, LOAD_TENANTS, tenantsQuery)({
    filterBy: [
        ...where,
        { field: 'name', op: 'is not null' }, // is to fix data that doesn't have name should be removed once DB is ok
        { field: 'classes.uri', op: '=', value: 'UMS/Tenant' },
    ],
    orderBy: [{ field: 'name', direction: 'asc' }]
});


/**
 * load the vendors
 */
export const loadVendors = ({ where = [] }: Object = {}) => loadData(LOAD_VENDORS_STARTED, LOAD_VENDORS, vendorsQuery)({
    filterBy: [
        ...where,
        { field: 'name', op: 'is not null' }, // is to fix data that doesn't have name should be removed once DB is ok
        { field: 'classes.uri', op: '=', value: 'UMS/Vendor' },
    ],
    orderBy: [{ field: 'name', direction: 'asc' }]
});

/**
 * load the regions
 */
export const loadRegions = ({ where = [] }: Object = {}) => loadData(LOAD_REGIONS_STARTED, LOAD_REGIONS, regionsQuery)({
    filterBy: [
        ...where,
        { field: 'name', op: 'is not null' }, // is to fix data that doesn't have name should be removed once DB is ok
        { field: 'classes.uri', op: '=', value: 'region' },
    ],
    orderBy: [{ field: 'name', direction: 'asc' }]
});

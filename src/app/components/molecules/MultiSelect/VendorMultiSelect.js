/* @flow */
import React, { PureComponent } from 'react';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import { loadVendors } from 'store/actions/common/multiselectActions';
import MultiSelect from 'app/components/atoms/MultiSelect/MultiSelect';
import DataMultiSelect from './DataMultiSelect';

/**
 * Multi-select dropdown to select the Vendors
 */
class VendorMultiSelect extends PureComponent<Object, Object> {

    static propTypes = { ...MultiSelect.propTypes }

     buildOptions = memoize((list: Array<Object>) =>
         list.filter(item => item).map(({ id, name }) => ({
             key: id,
             value: name,
             label: name,
         })));

     render() {
         return <DataMultiSelect {...this.props} buildOptions={this.buildOptions} />;
     }
}

export default connect(
    state => ({
        isLoading: state.common.multiselect.vendor.isLoading,
        records: state.common.multiselect.vendor.data,
    }),
    { loadOptions: loadVendors }
)(VendorMultiSelect);

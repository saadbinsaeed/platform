/* @flow */
import React, { PureComponent } from 'react';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import { loadGateways } from 'store/actions/common/multiselectActions';
import MultiSelect from 'app/components/atoms/MultiSelect/MultiSelect';
import DataMultiSelect from './DataMultiSelect';


/**
 * Multi-select dropdown to select the Gateways
 */
class GatewayMultiSelect extends PureComponent<Object, Object> {

    static propTypes = { ...MultiSelect.propTypes }

     buildOptions = memoize((list: Array<Object>) =>
         list.filter(item => item).map(({ id, display_name }) => ({
             key: id,
             value: display_name,
             label: display_name,
         })));

     render() {
         return <DataMultiSelect {...this.props} buildOptions={this.buildOptions} />;
     }
}

export default connect(
    state => ({
        isLoading: state.common.multiselect.gateway.isLoading,
        records: state.common.multiselect.gateway.data,
    }),
    { loadOptions: loadGateways }
)(GatewayMultiSelect);

/* @flow */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import { loadRegions } from 'store/actions/common/multiselectActions';
import MultiSelect from 'app/components/atoms/MultiSelect/MultiSelect';
import DataMultiSelect from './DataMultiSelect';

/**
 * Multi-select dropdown to select the Regions
 */
class RegionMultiSelect extends PureComponent<Object, Object> {

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
        isLoading: state.common.multiselect.region.isLoading,
        records: state.common.multiselect.region.data,
    }),
    { loadOptions: loadRegions }
)(RegionMultiSelect);

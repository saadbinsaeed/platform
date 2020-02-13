/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MultiSelect from 'app/components/atoms/MultiSelect/MultiSelect';

const MultiSelectStyled = styled(MultiSelect)`
    min-height: 25px;
    line-height: 1.3rem;

`;

/**
 * Multi-select dropdown to select the Gateways
 */
class DataMultiSelect extends PureComponent<Object, Object> {

    static propTypes = {
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        buildOptions: PropTypes.func.isRequired,
    };

    style = { width: '100%' };

    /**
     * @param props
     */
    constructor(props: Object) {
        super(props);
        const { isLoading, records } = this.props;
        if (!isLoading && !records) {
            this.props.loadOptions();
        }
    }

    /**
     * @Override
     */
    render() {
        const { loadOptions, buildOptions, records, ...multiSelectOptions } = this.props;
        const options = buildOptions(records || []);
        return <MultiSelectStyled {...multiSelectOptions} options={options} style={this.style} />;
    }
}

export default DataMultiSelect;

/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { SelectButton } from 'primereact/components/selectbutton/SelectButton';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';

/**
 * Component for showing ordering state
 */
const SelectButtonComponent = ({ onChange, options, optionLabel, value, ...rest }: Object) => (
    <SelectButton
        onChange={onChange}
        options={options}
        optionLabel={optionLabel}
        value={value}
        {...rest}
    />
);

export default compose(onlyUpdateForKeys(['value']), setPropTypes({
    onChange: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.any,
}))(SelectButtonComponent);

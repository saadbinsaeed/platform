// @flow
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';
import { onChangeFix } from 'app/utils/input/onChange';


const TextAreaStyle = styled(InputTextarea)`
`;


const TextArea = ({ children, rows, cols, value, autoResize, disabled, onChange, name }) => <TextAreaStyle
    name={name}
    rows={rows}
    cols={cols}
    value={value}
    autoResize={autoResize}
    disabled={disabled}
    onChange={onChangeFix.bind(null, onChange)}
>
    {children}
</TextAreaStyle>;

export default compose(
    onlyUpdateForKeys(['rows', 'cols', 'children', 'value', 'autoResize', 'onChange', 'disabled', 'name']),
    setPropTypes({
        rows: PropTypes.number,
        cols: PropTypes.number,
        children: PropTypes.any,
        value: PropTypes.string,
        name: PropTypes.string,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
    }),
)(TextArea);

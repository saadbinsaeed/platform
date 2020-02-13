/* @flow */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Input from 'app/components/atoms/Input/Input';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Icon from 'app/components/atoms/Icon/Icon';
import TextArea from 'app/components/atoms/TextArea/TextArea';
import Label from 'app/components/molecules/Label/Label';
import { SizeProps } from 'app/utils/propTypes/common';
import { onChangeFix } from 'app/utils/input/onChange';

const FieldLabel = styled(Label)`
    word-break: break-all;
`;

const InputFieldWrapper = styled.div`
  position: relative;
  & .Icon, .fieldIcon {
    position: absolute;
    top: .5rem;
    left: .7rem;
  }
  & Input {
    ${ ( { icon } ) => icon ? 'padding-left: 2rem;' : '' }
  }
`;
/**
 * onChange event handler
 *
 * @param value
 * @param multiline
 * @param props
 * @returns {*}
 */
const buildInput = ({ value, multiline, ...props }: Object) => {
    const defValue = value || '';
    return multiline ? <TextArea {...props} value={defValue || ''} /> : <Input {...props} value={value || ''} />;
};

const Field = (props: Object) => {
    const childrenProps = { ...props };
    const { label, name, required, icon, iconType, size } = props;
    return (
        <InputWrapper
            innerRef={(element) => {
                // if the inputRef property is defined pass the input element to the function
                if (props.inputRef) {
                    const input = element && element.getElementsByTagName ? element.getElementsByTagName('input')[0] : null;
                    if (input) {
                        props.inputRef(input);
                    }
                }
            }}
        >
            { label && <FieldLabel htmlFor={name} required={required} size={size}>{label}</FieldLabel> }
            <InputFieldWrapper {...childrenProps}>
                {icon && <Icon name={icon} type={iconType} size="sm" className="fieldIcon" />}
                {buildInput({ ...props, onChange: onChangeFix.bind(null, props.onChange) })}
            </InputFieldWrapper>
        </InputWrapper>
    );
};

Field.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    type: PropTypes.string,
    max: PropTypes.string,
    min: PropTypes.string,
    step: PropTypes.string,
    iconType: PropTypes.string,
    text_ext: PropTypes.string,
    text_ext_position: PropTypes.string,
    size: SizeProps,
    required: PropTypes.bool,
    icon: PropTypes.string,
    inputRef: PropTypes.func,
};
Field.defaultProps = {
    title: '',
    iconType: 'mdi'
};


export default Field;

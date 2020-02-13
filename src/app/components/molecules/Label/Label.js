/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Required from 'app/components/atoms/Required/Required';
import { ChildrenProp, SizeProps } from 'app/utils/propTypes/common';

// Styles
const InputLabelStyle = styled.label`
    display: block;
    font-size: .9rem;
    font-weight: 500;
    text-transform: capitalize;
    color: ${ ( { theme } ) => theme.base.textColor };
`;

// Component
const Label = ( props: Object ) => {
    return (
        <InputLabelStyle {...props} className={props.className}>
            {props.children || props.text} {props.required && <Required>*</Required>}
        </InputLabelStyle>
    );
};
Label.propTypes = {
    required: PropTypes.bool,
    children: ChildrenProp,
    size: SizeProps,
    className: PropTypes.string,
    text: PropTypes.string,
};


export default Label;

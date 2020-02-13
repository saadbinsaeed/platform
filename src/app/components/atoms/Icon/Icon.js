/* @flow */

// here https://materialdesignicons.com/ you can find the list of icon

import React from 'react';
import styled, { css } from 'styled-components';
import { palette } from 'styled-theme';
import IconProps from './IconProps';

const iconSizes = css`
  font-size: ${( { size, theme } ) => theme.sizes[ size ].icon } !important;
`;

/* eslint-disable indent */
const IconStyle = styled.i`
    display: inline-block;
    text-rendering: auto;
    line-height: inherit;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: 'liga';
    cursor: ${({ onClick }) => !!onClick ? 'pointer' : 'normal' };
    &:before {
        ${iconSizes};
        display: block !important;
        color: ${
            ( { color, colorIndex, theme, hexColor, disabled } ) => {
                if (disabled) {
                    return theme.base.disabled.textColor;
                }
                if (color) {
                    return palette(color, colorIndex || 0, true);
                }
                return hexColor || theme.base.textColor;
            }
        };
        text-shadow: ${( { shadow, theme } ) => shadow ? theme.shadow.z3 : 'none' };
    }
`;
/* eslint-enable indent */

const Icon = (props: Object) => {
    const { name, type, size, color, colorIndex, hexColor, className, ...rest } = props;
    return <IconStyle size={size} color={color} hexColor={hexColor} colorIndex={colorIndex} className={`Icon ${type} ${type}-${name} ${className}`} {...rest} />;
};

Icon.propTypes = {
    ...IconProps
};

Icon.defaultProps = {
    type: 'mdi',
    size: 'md',
    colorIndex: 0
};

export default Icon;

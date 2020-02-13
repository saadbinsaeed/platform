/* @flow */
import React from 'react';
import styled from 'styled-components';
// import { palette } from 'styled-theme';
import { lighten, darken } from 'polished';

import Loader from 'app/components/atoms/Loader/Loader';
import Icon from '../Icon/Icon';
import ButtonProps from './ButtonProps';

// { theme: { primary }, color }
const ButtonStyle = styled.button`
      cursor: pointer;
      color: ${({ color, theme }) => theme && color ? 'white' : theme.base.textColor};
      background:  ${({ color, theme }) => theme && color ? theme.color[color] : 'none'};
      border-radius: ${({ rounded }) => rounded ? '500rem' : '.2rem'};
      padding: .45rem .8rem;
      margin: 0 .3rem;
      &:first-child {
        margin-left:0;
      }
      &:last-child {
        margin-right:0;
      }
      ${({ fluid }) => fluid ? 'width: 100%' : ''};
      box-shadow: ${({ theme, color, noShadow }) => theme && color && !noShadow ? theme.shadow.z1 : 'none'};
      border: 0 none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: background .3s ease-in-out;
      &:hover {
          color: ${({ color, theme }) => theme && color ? 'white' : theme.base.active.textColor} !important;
          background: ${({ color, theme }) => theme && color ? lighten(0.1, theme.color[color]) : 'none'} !important;
      }
      &.active {
          color: ${({ color, theme }) => theme && color ? 'white' : theme.base.active.textColor} !important;
          background: ${({ color, theme }) => theme && color ? lighten(0.1, theme.color[color]) : 'none'} !important;
      }
      &:active {
          color: ${({ color, theme }) => theme && color ? 'white' : theme.base.active.textColor} !important;
          background: ${({ color, theme }) => theme && color ? lighten(0.1, theme.color[color]) : 'none'} !important;
      }
      &:focus {
          color: ${({ color, theme }) => theme && color ? 'white' : theme.base.active.textColor} !important;
          background: ${({ color, theme }) => theme && color ? lighten(0.1, theme.color[color]) : 'none'} !important;
          outline: solid 1px ${({ color, theme }) => theme && color ? darken(0.05, theme.color[color]) : 'none'} !important;
      }
      &:disabled {
          cursor: default !important;
          color: ${({ theme }) => theme.base.disabled.textColor} !important;
          background: ${({ theme }) => theme.base.disabled.background} !important;
      }
`;

const ButtonInner = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;    
`;

/**
 * Renders a button.
 *
 * @example <Button color="red" loading icon="delete" onClick="() => { alert('deleted') }" />
 *
 * For a complete list of all the available icons refer to https://materialdesignicons.com/
 */

const Button = (props: Object) => {

    const { text, color, fluid, icon, iconColor, iconType, iconSize, children, loading, onClick, rounded, noShadow, ...rest } = props;
    if (loading) {
        return (
            <ButtonStyle color={color} fluid={fluid} rounded={rounded} onClick={onClick} noShadow={noShadow} {...rest}>
                <ButtonInner>
                    <Loader radius="20"/>
                </ButtonInner>
            </ButtonStyle>
        );
    }

    return (
        <ButtonStyle color={color} fluid={fluid} rounded={rounded} onClick={onClick} noShadow={noShadow} {...rest}>
            <ButtonInner>
                {text} {children} {icon && <Icon type={iconType} name={icon} size={iconSize} color={iconColor}/>}
            </ButtonInner>
        </ButtonStyle>
    );
};

Button.propTypes = {
    ...ButtonProps,
};

Button.defaultProps = {
    iconType: 'mdi',
    loading: false,
    fluid: false,
};

export default Button;

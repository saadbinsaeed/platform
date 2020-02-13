/* @flow */
import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { onChangeFix } from 'app/utils/input/onChange';

const ExtensionBefore = styled.div`
  position: absolute;
  top: .4rem;
  left: .7rem;
  color: #cccccc;
`;
const ExtensionAfter = styled.div`
  position: absolute;
  top: .4rem;
  right: .7rem;
  color: #cccccc;
`;

const inputSizes = css`
    width: 100%;
    font-size: ${( { theme, size } ) => size ? theme.sizes[size].fontSize : theme.sizes.md.fontSize};
    height: ${( { theme, size } ) => size ? theme.sizes[size].height : theme.sizes.md.height};
    line-height: ${( { theme, size } ) => size ? theme.sizes[size].lineHeight : theme.sizes.md.lineHeight};
    border-radius: ${( { theme, size } ) => size ? theme.sizes[size].borderRadius : theme.sizes.md.borderRadius};
    padding: ${( { theme, size } ) => size ? `${theme.sizes[size].paddingTB} ${theme.sizes[size].paddingLR}` : `${theme.sizes.md.paddingTB} ${theme.sizes.md.paddingLR}`};
    &::placeholder {
        font-size: ${( { theme, size } ) => size ? theme.sizes[size].fontSize : theme.sizes.md.fontSize};
    }
`;

const InputWrapper = styled.div`
  width: 100%;
`;

const InputStyle = styled.input`
  ${inputSizes};
  font-size: inherit;
  display: flex;
  flex-grow: 1;
  text-align: left;
  margin: 0;
  border: ${( { theme } ) => `solid 1px ${theme.base.borderColor}` };
  color: ${( { theme } ) => theme.base.textColor };
  background: ${( { theme } ) => theme.input.background };
  outline: none;
  padding-left: ${({text_ext, text_ext_position}) => text_ext && text_ext_position === 'before' && `${(text_ext.length/2)+1}rem` };
  padding-right: ${({text_ext, text_ext_position}) => text_ext && text_ext_position === 'after' && `${(text_ext.length/2)+1.5}rem` };

  &::placeholder {
      color: ${( { theme } ) => theme.input.placeholder };
   }
   &:hover {
      color: ${( { theme } ) => theme.input.hover.textColor };
      border: solid 1px ${( { theme } ) => theme.input.hover.borderColor };
      background: ${( { theme } ) => theme.input.hover.background };
   }
   &:focus {
      color: ${( { theme } ) => theme.input.active.textColor };
      border: solid 1px ${( { theme } ) => theme.input.active.borderColor };
      background: ${( { theme } ) => theme.input.active.background };
   }
   &:disabled, &:disabled:hover {
      color: ${( { theme } ) => theme.input.disabled.textColor };
      border: ${( { theme } ) => `solid 1px ${theme.input.disabled.borderColor}` };
      background: ${( { theme } ) => theme.input.disabled.background };
   }
   &:required {
      box-shadow: none;
   }
   &.error {
      color: ${( { theme } ) => theme.input.error.textColor };
      border: ${( { theme } ) => `solid 1px ${theme.input.error.borderColor}` };
      background: ${( { theme } ) => theme.input.error.background };
   }
`;

/**
 *
 */
class Input extends PureComponent<Object> {

    static propTypes = {
        type: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.any,
        text_ext: PropTypes.string,
        text_ext_position: PropTypes.string,
    };

    static defaultProps = {
        type: 'text'
    };

    render() {
        const { value, onChange, ...inputProps } = this.props; // eslint-disable-line no-unused-vars
        const { text_ext, text_ext_position } = inputProps;
        return (
            <InputWrapper>
                {text_ext && text_ext_position === 'before' && <ExtensionBefore>{text_ext}</ExtensionBefore>}
                <InputStyle value={value !== null ? value : undefined} onChange={onChangeFix.bind(null, onChange)} {...inputProps} />
                {text_ext && text_ext_position === 'after' && <ExtensionAfter>{text_ext}</ExtensionAfter>}
            </InputWrapper>
        );
    }
};

export default Input;

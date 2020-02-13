/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TextAreaStyle = styled.textarea`
  width: 100%;
  font-size: ${( { theme, size } ) => size ? theme.sizes[size].fontSize : theme.sizes.md.fontSize};
  border-radius: ${( { theme, size } ) => size ? theme.sizes[size].borderRadius : theme.sizes.md.borderRadius};
  padding: ${( { theme, size } ) => size ? `${theme.sizes[size].paddingTB} ${theme.sizes[size].paddingLR}` : `${theme.sizes.md.paddingTB} ${theme.sizes.md.paddingLR}`};
  &::placeholder {
    font-size: ${( { theme, size } ) => size ? theme.sizes[size].fontSize : theme.sizes.md.fontSize};
  }
  border: ${({ theme }) => `solid 1px ${theme.base.borderColor}`};
  color: ${({ theme }) => theme.base.textColor};
  background: ${({ theme }) => theme.input.background};
`;

/**
 *
 */
class SimpleTextArea extends PureComponent<Object, Object> {

    static propTypes = {
        name: PropTypes.string,
        value: PropTypes.string,
        onBlur: PropTypes.func,
        onChange: PropTypes.func
    };

    onChange = (event: Object) => {
        const { name, value } = event.target;
        this.props.onChange && this.props.onChange({ originalEvent: event, name, value });
    };

    onBlur = (event: Object) => {
        const { name, value } = event.target;
        this.props.onBlur && this.props.onBlur({ originalEvent: event, name, value });
    };

    render() {
        const { name } = this.props;
        return <TextAreaStyle name={name} value={this.props.value} onChange={this.onChange} onBlur={this.onBlur} />;
    }
}



export default SimpleTextArea;

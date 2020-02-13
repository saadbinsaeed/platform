/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bind } from 'app/utils/decorators/decoratorUtils';

// UI Imports
import TextIcon from '../TextIcon/TextIcon';

const UploadButtonStyle = styled.span`
      display: inline-block;
`;
const InputStyled = styled.input`
      display: none;
`;

/**
 * Button used to upload a file
 */
class UploadButton extends Component<Object> {

    static propTypes: Object = {
        loading: PropTypes.bool,
        icon: PropTypes.string,
        label: PropTypes.string,
        onSelect: PropTypes.func.isRequired,
    };

    static defaultProps: Object = {
        loading: false,
        multiple: false,
    };

    inputRef = React.createRef();

    @bind
    onClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.props.loading && this.inputRef.current) {
            this.inputRef.current.click(); // this opens the browser popup to select the file
        }
    }

    @bind
    onClickInput(event: Event) {
        event.stopPropagation();
    };

    @bind
    onFileSelect(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        const { multiple } = this.props;
        const { files } = this.inputRef.current || {};
        if (files && files[0] && !this.props.loading && this.props.onSelect) {
            this.props.onSelect(multiple ? files : files[0]);
            if (this.inputRef.current) this.inputRef.current.value = '';
        }
    };

    render() {
        const { icon, label, loading, margin, alt, multiple } = this.props;
        return (
            <UploadButtonStyle alt={alt}>
                <InputStyled onClick={this.onClickInput} type="file" name="file" onChange={this.onFileSelect} innerRef={this.inputRef}  multiple={multiple} />
                <TextIcon type={'button'} margin={margin} loading={loading} icon={icon || 'cloud-upload'} label={label} size="md" onClick={this.onClick} />
            </UploadButtonStyle>
        );
    }
}

export default UploadButton;

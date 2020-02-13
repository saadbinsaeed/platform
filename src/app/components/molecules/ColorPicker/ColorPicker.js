/* @flow */

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { SwatchesPicker } from 'react-color';

import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Label from 'app/components/molecules/Label/Label';
import { materialColorPalette } from 'app/themes/palette';
import Icon from 'app/components/atoms/Icon/Icon';

const SwatchesPickerStyle = styled(SwatchesPicker)`
    width: 243px !important;
    & > div div:nth-child(2) {
        background: #2c2c2c !important;
    }
    & > div div:nth-child(1) > div > span div:nth-child(1) {
        fill: white !important;
    }
`;

/**
 * Create a standard app color picker than can be used throughout the application
 */
class ColorPicker extends PureComponent<Object, Object> {


    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);

        this.state = { displayColorPicker: false };
    }
    static deafultValue = '#00BCD4';
    static defaultColors = [['#066ab1', '#0779ca'], [ '#FFFFFF', '#00a99d', '#066ab1', '#4FC3F7', '#81C784', '#FF8A65', '#FFC107', '#FF5722', '#c62828' ]];

    onChange = (value: Object) => {
        const { onChange, name } = this.props;
        onChange && onChange({ target: { name, value: (value || {}).hex } });
    };

    handleSwatches = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    render() {
        const { label, name, value, required, size } = this.props;
        const { displayColorPicker } = this.state;

        return (
            <InputWrapper>
                { label &&
                <Label htmlFor={name} required={required} size={size}>
                    {label}
                    <Icon onClick={this.handleSwatches} hexColor={value ? value : '#00BCD4'} style={{marginLeft: '1rem'}} name={'circle'} />
                </Label> }
                {
                    displayColorPicker &&
                    <SwatchesPickerStyle
                        name={name}
                        color={value || ColorPicker.deafultValue}
                        colors={materialColorPalette || ColorPicker.defaultColors}
                        onChange={this.onChange}
                    />
                }
            </InputWrapper>
        );
    }
}

export default ColorPicker;

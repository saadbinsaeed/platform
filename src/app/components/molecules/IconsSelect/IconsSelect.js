/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AutoComplete as PrimeAutoComplete } from 'primereact/components/autocomplete/AutoComplete';

import Icon from 'app/components/atoms/Icon/Icon';
import Label from 'app/components/molecules/Label/Label';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import { set } from 'app/utils/lo/lo';
import { iconsList, iconsSet } from 'app/utils/styles/mdi';
import { includes } from 'app/utils/filter/filterUtils';


const AutoComplete = styled(PrimeAutoComplete)`
    &.ui-autocomplete {
        display: flex;
    }
    .ui-button-icon-only .ui-button-text {
        padding: 0.74em;
    }
    .ui-corner-all {
        border-radius: 0;
        border-color: black;
    }

    .ui-inputtext {
        width: 100%;
    }
`;

const IconPreview = styled.span`
    border: 0.5px solid black;
    borderRight: none;
    padding: 0 0.5em;
`;

/**
 *
 */
class IconsSelect extends PureComponent<Object, Object> {

    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        label: PropTypes.string,
        name: PropTypes.string,
        required: PropTypes.bool,
        size: PropTypes.number,
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            filteredOptions: null,
            value: props.value,
        };
    }

    componentDidUpdate(prevProps: Object, prevState: Object, snapshot: Object) {
        const value = this.props.value;
        if (prevProps.value !== value) {
            this.setState({ value });
        }
    }

    filterOptions = (event: Object) => {
        this.setState({ filteredOptions: includes(iconsList, event.query) });
    }

    optionTemplate = (icon: string) => <Fragment><Icon name={icon} /> {icon}</Fragment>;

    onChange = ({ originalEvent, value }: Object) => {
        this.setState({ value });
        if (!this.props.onChange) {
            return;
        }
        const isValid = iconsSet.has(value);
        let event = set(originalEvent, 'target.name', this.props.name);
        event = set(event, 'target.value', isValid ? value : null);
        this.props.onChange(event, isValid ? value : null);
    }

    /**
     * @override
     * @returns {XML}
     */
    render() {
        const { value, filteredOptions } = this.state;
        const { disabled, label, name, required, size } = this.props;
        return (
            <InputWrapper>
                { label && <Label htmlFor={name} required={required} size={size}>{label}</Label> }
                <div className="ui-inputgroup">
                    <IconPreview>
                        <Icon color={disabled ? 'grey' : null} name={value && iconsSet.has(value) ? value : 'blank'} />
                    </IconPreview>
                    <AutoComplete
                        name={name}
                        value={value}
                        suggestions={filteredOptions}
                        completeMethod={this.filterOptions}
                        itemTemplate={this.optionTemplate}
                        onChange={this.onChange}
                        placeholder="Select an icon"
                        dropdown={true}
                        size={30}
                        minLength={1}
                        disabled={disabled}
                    />
                </div>
            </InputWrapper>
        );

    }
}


export default IconsSelect;

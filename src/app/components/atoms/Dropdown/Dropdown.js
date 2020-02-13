/* @flow */

import React, { PureComponent } from 'react';
import styled from 'styled-components';

import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Label from 'app/components/molecules/Label/Label';
import PrimeDropdown from './PrimeDropdown';
import { isDefined } from 'app/utils/utils';

const DropdownStyled = styled(PrimeDropdown)`
width: 100% !important;
font-size: 1rem !important;
line-height: 2rem;
.ui-dropdown-panel .ui-dropdown-item{
    font-size: 1rem !important;
}
`;

class Dropdown extends PureComponent<Object, Object> {

    onChange = (event: Object) => {
        const { onChange, name } = this.props;
        onChange && onChange({
            ...event,
            target: { name, value: event.value },
            name,
        });
    };

    render() {
        const { required, clearable, label, value, ...restProps } = this.props;
        const val = isDefined(value) ? value : '';
        return (
            <InputWrapper>
                {label && <Label required={required}>{label}</Label>}
                <DropdownStyled
                    {...restProps}
                    value={ val }
                    required={required}
                    showClear={clearable}
                    onChange={this.onChange}
                />
            </InputWrapper>);
    }
}

export default Dropdown;

/* @flow */
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import uuidv4  from 'uuid/v4';

import { Calendar } from 'primereact/components/calendar/Calendar'; // No choice - all bug fixes in this version
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Label from 'app/components/molecules/Label/Label';

const CalendarWrapper = styled.span`
  display: block;
  & input {
    width: 100%;
  }
`;

const calendarStyle = {
    display: 'block', width: '100%'
};

/**
 * A date-time input component
 */
class DateTimeRangePicker extends PureComponent<Object, Object> {

    id = uuidv4();

    /**
     * Create synthetic event for name and value output
     * @param event
     */
    onChange = (event: Object) => {
        const value = (event.value || []).filter(el => el);
        if (this.props.onChange) {
            this.props.onChange({ name: this.props.name, value });
        }
    };

    /**
     * Render our component
     * @returns {*}
     */
    render() {
        const { name, required, label, value, readOnlyInput } = this.props;
        return (
            <InputWrapper>
                <Label htmlFor={`${this.id}_${name}`} required={required}>{label}</Label>
                <CalendarWrapper>
                    <Calendar
                        id={`${this.id}_${name}`}
                        name={name}
                        value={value}
                        dateFormat="dd/mm/yy"
                        /*showTime="true"*/
                        selectionMode="range"
                        readOnlyInput={readOnlyInput}
                        style={calendarStyle}
                        hourFormat="24"
                        showButtonBar
                        onChange={this.onChange} />
                </CalendarWrapper>
            </InputWrapper>
        );
    }
}

export default DateTimeRangePicker;

/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, TimePicker, DateTimePicker } from '@mic3/platform-ui';
import styled from 'styled-components';

import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Input from 'app/components/atoms/Input/Input';
import Label from '../Label/Label';
import { get } from 'app/utils/lo/lo';
import { saveByKind } from 'app/utils/date/date';

const CalendarWrapper = styled(InputWrapper)`
${({ spacing }) => spacing && `padding: ${spacing};`}
`;

const InputStyled = styled(Input)`
    ${({ tiny }) => tiny && `
        height: 27px;
        border-radius: 3px;

        &::placeholder {
            font-size: 1em;
        }
    `}
`;

const ReadOnlyInput = props => <InputStyled {...props} readOnly />;
const DisabledInput = props => <ReadOnlyInput {...props} onClick={() => {}} />;


/**
 * A date-time input component
 */
class DateTimePickerModal extends PureComponent<Object, Object> {

    static propTypes = {
        format: PropTypes.string,
        kind: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        label: PropTypes.string,
        readOnly: PropTypes.bool,
        required: PropTypes.bool,
        onChange: PropTypes.func,
        disableFormating: PropTypes.bool,
        tiny: PropTypes.bool,
    }

    static defaultProps = {
        format: 'DD/MM/YY',
        kind: 'datetime',
        disableFormating: false,
        tiny: false,
    }

    /**
     * Create synthetic event for name and value output
     * @param event
     */
    onChange = (event: Object) => {
        const value = get(event, 'target.value');
        if (this.props.onChange && !this.props.disableFormating) {
            this.props.onChange({ target: {
                name: this.props.name,
                value: value ? saveByKind(this.props.kind, value) : value,
            }});
        } else {
            this.props.onChange(event);
        }
    };

    /**
     * Render our component
     * @returns {*}
     */
    render() {
        const { placeholder, tiny, name, required, label, value, kind, format, readOnly, spacing } = this.props;
        const DateComponentProps = {
            format: {
                time: 'HH:mm',
                date: format.toUpperCase(),
                datetime: `${format.toUpperCase()} HH:mm`,
            }[kind || 'datetime'],
            value: required ? (value || new Date()) : value,
            onChange: this.onChange,
            TextFieldComponent: readOnly ? DisabledInput : ReadOnlyInput,
            key: kind,
            id: name,
            disable: readOnly,
            fullWidth: true,
            showTodayButton: true,
            clearable: !required,
            DialogProps : { style: { zIndex: 3000 }},
            placeholder,
            tiny,
            name,
        };

        const DateComponent = {
            time: <TimePicker {...DateComponentProps} ampm={false} />,
            date: <DatePicker {...DateComponentProps}/>,
            datetime: <DateTimePicker {...DateComponentProps} ampm={false} />,
        }[kind || 'datetime'];

        return (
            <CalendarWrapper spacing={spacing}>
                <Label htmlFor={name} required={required}>{label}</Label>
                {DateComponent}
            </CalendarWrapper>

        );
    }
}

export default DateTimePickerModal;

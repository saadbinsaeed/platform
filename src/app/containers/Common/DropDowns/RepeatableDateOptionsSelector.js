/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import Field from 'app/components/molecules/Field/Field';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import DaySelectorRow from 'app/components/molecules/DaySelectorRow/DaySelectorRow';
import DateTimePickerModal from 'app/components/molecules/DataTimePicker/DateTimePickerModal';

/**
 * A component for creating repeatable events
 */
class RepeatableDateOptionsSelector extends PureComponent<Object, Object> {

    static propTypes = {
        onChange: PropTypes.func,
        onDaysChange: PropTypes.func,
        isRepeatableName: PropTypes.string,
        isRepeatableValue: PropTypes.bool,
        repeatIntervalName: PropTypes.string,
        repeatIntervalValue: PropTypes.string,
        repeatValueName: PropTypes.string,
        repeatValue: PropTypes.any,
        repeatEndsName: PropTypes.string,
        repeatEndsValue: PropTypes.any,
    };

    /**
     * Render put select option
     */
    render() {
        // Pass our props
        const {
            isRepeatableName,
            isRepeatableValue,
            repeatIntervalName,
            repeatIntervalValue,
            repeatValueName,
            repeatValue,
            repeatEndsName,
            repeatEndsValue,
            onChange,
            onDaysChange
        } = this.props;

        const repeatTypes = [
            { value: 'H', label: 'Hourly', name: 'Hour' },
            { value: 'D', label: 'Daily', name: 'Day' },
            { value: 'DW', label: 'By Day of Week', name: 'Day(s) of the week' },
            { value: 'W', label: 'Weekly', name: 'Week' },
            { value: 'M', label: 'Monthly', name: 'Month' },
            { value: 'Y', label: 'Yearly', name: 'Year' },
        ];
        const selectedRepeatType = repeatTypes.find(key => key.value === repeatIntervalValue) || {};

        return (
            <div>
                <Checkbox
                    name={isRepeatableName}
                    label="Repeat"
                    onChange={onChange}
                    checked={isRepeatableValue}
                />
                <div style={isRepeatableValue && isRepeatableValue ? { display: 'block' } : { display: 'none' }}>
                    <Dropdown
                        label="Repeats"
                        name={repeatIntervalName}
                        placeholder="e.g. Weekly"
                        options={repeatTypes}
                        onChange={onChange}
                        value={repeatIntervalValue}
                        required={isRepeatableValue}
                    />
                    {
                        repeatIntervalValue && repeatIntervalValue !== 'DW' &&
                        <Field
                            onChange={onChange}
                            label={`Repeats Every _${selectedRepeatType.name}`}
                            type="number"
                            name={repeatValueName}
                            value={repeatValue}
                            placeholder="e.g. 1"
                            required={isRepeatableValue}
                        />
                    }
                    {
                        repeatIntervalValue && repeatIntervalValue === 'DW' &&
                        <DaySelectorRow
                            onChange={onDaysChange}
                            label={`Repeats Every _${selectedRepeatType.name}`}
                            name={repeatValueName}
                            value={repeatValue}
                        />
                    }
                    <DateTimePickerModal
                        label="Repeat ends"
                        name={repeatEndsName}
                        value={repeatEndsValue}
                        onChange={onChange}
                        required={isRepeatableValue}
                    />
                </div>
            </div>
        );
    }
}

export default RepeatableDateOptionsSelector;

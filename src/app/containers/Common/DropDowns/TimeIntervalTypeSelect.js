/* @flow */

import React, { PureComponent } from 'react';

import Dropdown from 'app/components/atoms/Dropdown/Dropdown';

/**
 * Select component that lists a number of time select types i.e. Hours, Weekly, Monthly etc
 */
class TimeIntervalTypeSelect extends PureComponent<Object, Object> {
    /**
     * Render put select option
     */
    render() {
        const { name, label, placeholder, value, required, onChange } = this.props;
        const options = [
            { value: 'D', label: 'Day(s)' },
            { value: 'H', label: 'Hour(s)' },
            { value: 'M', label: 'Minutes(s)' },
            { value: 'S', label: 'Second(s)' },
        ];
        return (
            <Dropdown
                label={label}
                name={name}
                placeholder={placeholder}
                options={options}
                onChange={onChange}
                value={value}
                required={required}
            />
        );
    }
}

export default TimeIntervalTypeSelect;

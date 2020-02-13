/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import DateTimePickerModal from 'app/components/molecules/DataTimePicker/DateTimePickerModal';

class CalendarRange extends PureComponent<Object, Object> {

    static propTypes = {
        ...DateTimePickerModal.propTypes,
        value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])),
    };

    state: {
        start: ?Date,
        end: ?Date,
    }

    constructor(props: Object) {
        super(props);
        const [ start, end ] = (props.value && props.value.map(date => new Date(date))) || [null, null];
        this.state = { start, end };
    }

    componentDidUpdate(prevProps: Object, prevState: Object) {
        const props = this.props;
        const [ start, end ] = (props.value && props.value.map(date => new Date(date))) || [null, null];
        if (prevProps.value !== this.props.value) {
            this.setState({ start, end });
        }
    }

    onChange = () => {
        const { name, onChange } = this.props;
        if (!onChange) {
            return;
        }
        const { start, end } = this.state;
        const value = start && [ start, end ];
        onChange && onChange({ name, value, target: { name, value } });
    }

    onChangeStart = ({ target: { value }}: { target: { value: ?Date }}) => {
        let { end } = this.state;
        let start = value && new Date(value);
        if (!start) {
            end = null;
        } else if (!end) {
            end = new Date(start);
            end.setHours(23, 59, 59, 999);
        } else if (start.getTime() >= end.getTime()) {
            start = new Date(end.getTime());
        }
        start && start.setMilliseconds(0);
        this.setState({ start, end }, this.onChange);
    }

    onChangeEnd = ({ target: { value }}: { target: { value: ?Date }}) => {
        let { start } = this.state;
        let end = value && new Date(value);
        if (end && !this.state.end) {
            end.setHours(23, 59, 59, 999);
        }
        if (!end) {
            start = null;
        } else if (!start) {
            start = new Date(end);
            start.setHours(0, 0, 0, 0);
        } else if (start.getTime() >= end.getTime()) {
            end = new Date(start.getTime());
        }
        end && end.setMilliseconds(999);
        this.setState({ start, end }, this.onChange);
    }

    render() {
        const { minDate, maxDate, placeholderFrom, placeholderTo, tiny, ...restProps } = this.props;
        const { start, end } = this.state;
        return (
            <Fragment>
                <DateTimePickerModal
                    {...restProps}
                    key={`startKey_${String(end)}`} /* max date is not refrehed otherwise */
                    onChange={this.onChangeStart}
                    value={start}
                    placeholder={placeholderFrom || 'From'}
                    minDate={minDate}
                    maxDate={end || maxDate}
                    spacing='.5rem 0 .1rem 0'
                    tiny={tiny}
                />
                <DateTimePickerModal
                    {...restProps}
                    key={`endKey_${String(start)}`} /* min date is not refrehed otherwise */
                    onChange={this.onChangeEnd}
                    value={end}
                    placeholder={placeholderTo || 'To'}
                    minDate={start || minDate}
                    maxDate={maxDate}
                    spacing='.1rem 0 .5rem 0'
                    tiny={tiny}
                />
            </Fragment>
        );
    }
}

export default CalendarRange;

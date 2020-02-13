/*  @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { InputText as InputPrime } from 'primereact/components/inputtext/InputText';

const InputWidth = {
    width: '100%',
};

/**
 * A stateful InputText
 */
class InputText extends PureComponent<Object, Object> {

    static propTypes = {
        initialValue: PropTypes.string,
        onChange: PropTypes.func,
        validationRegEx: PropTypes.object,
    };

    state = { value: '' };

    /**
     *
     */
    constructor(props: Object) {
        super(props);
        this.state = { value: this.getValue(props.initialValue) };
    }

    getValue = (value: ?number | ?string = '') => {
        const { validationRegEx, min, max, type } = this.props;
        if (
            (validationRegEx && validationRegEx.test(value)) ||
            (!validationRegEx)
        ) {
            if (value && type === 'number') {
                if (min && Number(value) < min) {
                    return String(min);
                }
                if (max && Number(value) > max) {
                    return String(max);
                }
            }
            return value;
        }
        return this.state.value;

    }

    componentDidUpdate(prevProps: Object) {
        const { initialValue } = this.props;
        if(initialValue !== prevProps.initialValue) {
            this.setState({ value: this.getValue(initialValue) });
        }
    }

    onChange = (event: Object, el: Object) => {
        const value = this.getValue(event.target.value.trimLeft());
        const name = event.target.name;

        if(value !== this.state.value) {
            this.setState({ value });
            if (this.props.onChange) {
                this.props.onChange({ originalEvent: event, name, value });
            }
        }
    };

    onBlur = (event: Object) => {
        const { onBlur } = this.props;
        if (onBlur) {
            onBlur({
                originalEvent: event,
                name: event.target.name,
                value: this.state.value,
            });
        }
    };

    /**
     * @override
     */
    render() {
        // eslint-disable-next-line no-unused-vars
        const { initialValue, name, validationRegEx, onChange, onBlur, ...childProps } = this.props;
        return <InputPrime
            {...childProps}
            name={name}
            value={this.state.value || ''}
            onChange={this.onChange}
            onBlur={this.onBlur}
            style={InputWidth}
        />;
    }
}

export default InputText;

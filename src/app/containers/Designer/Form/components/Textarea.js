/* @flow */

import { TextField, IconButton, MdiIcon } from '@mic3/platform-ui';
import React, { PureComponent } from 'react';
import debouncePromise from 'debounce-promise';
import memoize from 'memoize-one';
import greenlet from 'greenlet';

import { get } from 'app/utils/lo/lo';

export default class Textarea extends PureComponent<Object, Object> {

    static defaultProps = {
        parseAs: 'text',
    }

    state: Object;
    inputRef: Object = React.createRef();

    constructor(props: Object) {
        super(props);
        const { value, parseAs } = props;
        this.state = {
            tic: 0,
            value,
            ...this.stringify(value, parseAs),
        };
    }

    componentDidUpdate(prevProps: Object) {
        const { value, parseAs } = this.props;
        if (prevProps.value !== value) {
            this.setState({
                value,
                ...this.stringify(value, parseAs),
            });
        }
    }

    stringify = memoize((value, parseAs) => { // parseAs is one of 'text', 'JSON', 'HTML', 'javascript'
        try {
            switch (parseAs) {
                case 'text': return { textValue: value };
                case 'JSON': return { textValue: typeof value === 'object' ? JSON.stringify(value) : null };
                case 'HTML': {
                    if (!value) {
                        return null;
                    }
                    return { textValue: value.innerHTML };
                }
                case 'javascript': return { textValue: value && String(value) };
                default:
            }
        } catch (e) {
            return { error: e && e.message };
        }
    });

    _parseFunction = greenlet((value) => {
        try {
            const jsFunction = eval(value); // eslint-disable-line no-eval
            if (typeof jsFunction !== 'function') {
                return { isValid: false, errorMessage: 'You must write a valid javascript function.' };
            }
            return { isValid: true, errorMessage: null };

        } catch (e) {
            return { isValid: false, errorMessage: e && e.message };
        }
    });


    parse = debouncePromise(memoize(async (value, parseAs) => { // parseAs is one of 'text', 'JSON', 'HTML', 'javascript'
        if (!value) {
            return { value: null,  errorMessage: null };
        }
        try {
            switch (parseAs) {
                case 'text': return { value, errorMessage: null };
                case 'JSON': {
                    const json = value && JSON.parse(value);
                    if (typeof json !== 'object') {
                        throw new Error('The value is not a valid JSON.');
                    }
                    return { value: json, errorMessage: null };
                }
                case 'HTML': {
                    if (!value) {
                        return null;
                    }
                    const div = document.createElement('div');
                    div.innerHTML = value;
                    return { value: div, errorMessage: null };
                }
                case 'javascript': {
                    const response = await this._parseFunction(value);
                    if (response.isValid) {
                        return { value: eval(value), errorMessage: null }; // eslint-disable-line no-eval
                    }
                    return { value: null, errorMessage: response.errorMessage };
                }
                default:
            }
        } catch (e) {
            return { value: null, errorMessage: e && e.message };
        }
    }), 300);

    onChange = ({ target: { name, value } }: Object) => {
        const { parseAs } = this.props;
        if (parseAs === 'HTML') {
            this.setState({ textValue: value });
            return;
        }
        if (this.state.textValue !== value) {
            this.setState({ textValue: value }, () => {
                this.parse(value, parseAs).then((response) => {
                    this.setState({ ...response }, () => {
                        if (!this.state.errorMessage) {
                            this.props.onChange && this.props.onChange({ target: { name, value: this.state.value }});
                        }
                    });
                });
            });
        }
    }

    onSave = () => {
        const { name, parseAs } = this.props;
        this.parse(this.state.textValue, parseAs).then((response) => {
            this.setState({ ...response }, () => {
                if (!this.state.errorMessage) {
                    this.props.onChange && this.props.onChange({ target: { name, value: this.state.value }});
                }
            });
        });
    }

    getHtmlProps = memoize((disabled, parseAs, InputProps, errorMessage) => {
        const cleareIcon = get(this.inputRef, 'current.endAdornment', null);
        return parseAs === 'HTML' ? {
            ref: this.inputRef,
            InputProps: {
                startAdornment: !disabled && [
                    <IconButton
                        key={0}
                        aria-label="Save html"
                        onClick={this.onSave}
                    >
                        <MdiIcon name="content-save" />
                    </IconButton>,
                    cleareIcon
                ],
            }
        } : {};
    });

    render() {
        const { onChange, value, helperText, parseAs, disabled, InputProps, ...restProps } = this.props;
        const errorMessage = this.state.errorMessage || this.props.errorMessage;
        const htmlTypeProps = this.getHtmlProps(disabled, parseAs, InputProps, errorMessage);
        return (
            <TextField
                rows="5"
                multiline
                {...restProps}
                {...htmlTypeProps}
                disabled={disabled}
                value={this.state.textValue}
                onChange={this.onChange}
                error={errorMessage}
                helperText={(errorMessage && `${parseAs} is not valid: ${errorMessage}`) || helperText}
            />
        );
    }
}

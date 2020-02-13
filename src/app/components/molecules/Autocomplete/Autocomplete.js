/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { AutoComplete as AutoCompletePrime } from 'primereact/components/autocomplete/AutoComplete';

import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Label from 'app/components/molecules/Label/Label';
import { get } from 'app/utils/lo/lo';
import { isString } from 'app/utils/string/string-utils';
import { debounce } from 'app/utils/utils';


class Auto extends AutoCompletePrime {

    /**
     * @override
     */
    alignPanel() {
        super.alignPanel();
        if(this.props.appendTo) {
            const target = this.props.multiple ? this.multiContainer : this.inputEl;
            const { left, width } = target.getBoundingClientRect();
            this.panel.element.style.left = left + 'px';
            this.panel.element.style.minWidth = width + 'px';
            this.panel.element.style.width = width + 'px';
        }
    }
}

const AutoComplete = styled(Auto)`
display: flex !important;
& button {
    height: 100%;
}

.ui-autocomplete-multiple-container.ui-inputtext {
    display: flex;
    flex-wrap: wrap;
    padding: .3em;
}

.ui-autocomplete-token {
    height: 2.2em;
    margin: .2em .3em;
    line-height: 1.85em;
}

.ui-autocomplete-token-label {
    font-size: 1.1em;
}

.ui-autocomplete-input-token {
    flex-grow: 1;
    min-height: 2em;
    line-height: 1.5em;
    align-items: center;
    color: ${({ theme }) => theme.input.textColor};
    input {
        color: ${({ theme }) => theme.input.textColor};
        font-size: ${({ theme }) => theme.base.fontSize};
    }
}

li.ui-autocomplete-list-item {
    word-wrap: break-word;
    width: ${({optionWidth}) => optionWidth}px;
}

input {
    width: 100% !important;
}

.ui-button-text {
    padding: .66rem !important;
}
`;


/**
 * A modal for search and add team members
 */
class Autocomplete extends PureComponent<Object, Object> {

    static propTypes = {
        ...AutoComplete.propTypes,
        required: PropTypes.bool,
    }

    // $FlowFixMe
    ref = React.createRef();

    constructor(props: Object) {
        super(props);
        this.state = { value: this.modifiableValue(props.value), width: 500, forceUpdateKey: 0 };
    }

    modifiableValue(value: ?Object | Array<Object>): ?Object | Array<Object> {
        if (!value) {
            return null;
        }
        return Array.isArray(value) ? value.map(e => ({ ...e })) : { ...value };
    }

    componentDidMount() {
        const container = get(this.ref, 'current.container');
        if (!container) {
            return;
        }
        this.updateWidth();
        window.addEventListener('resize', this.updateWidth);
        const { required, multiple, value } = this.props;
        this.setRequired(required, multiple, value);
    }

    componentDidUpdate(prevProps: Object) {
        const { required, multiple, value } = this.props;
        this.setRequired(required, multiple, value);
        if (value !== prevProps.value) {
            this.setState({
                value: this.modifiableValue(this.props.value),
                forceUpdateKey: this.state.forceUpdateKey + 1,
            });
        }
    }

    updateWidth = debounce(() => {
        if (this.ref.current && this.ref.current.container)
            this.setState({ width: this.ref.current.container.clientWidth - (this.props.multiple ? 42 : 32) });
    }, 500);

    setRequired = memoize((required: ?boolean, multiple: ?boolean, value: ?any) => {
        const input = get(this.ref, 'current.inputEl');
        if (input) {
            if (multiple) { // this fix the multiple selection "required" behaviour
                input.required = required && !value;
            } else {
                input.required = !!required;
            }
        }
    });

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWidth);
    }

    onChange = (event: Object) => {
        this.setState({ value: event.value });
        const value = event.value || null;
        if (value && isString(value)) {
            return;
        }
        const { onChange, name } = this.props;
        onChange && onChange({ ...event, target: { name, value } });
    };

    onBlur = (event: Object) => {
        const { value, multiple } = this.props;
        const input = get(this.ref, 'current.inputEl') || {};

        if (multiple) {
            // clean up the "multiple" incomplete research
            input.value = '';
        } else {
            // clean up the "single" incomplete research
            if (value && typeof this.state.value !== 'object') {
                // don't use when there is no value, it will break the single selection "required" behaviour)
                setTimeout(() => {
                    this.setState({
                        value: this.modifiableValue(this.props.value),
                        forceUpdateKey: this.state.forceUpdateKey + 1,
                    });
                }, 300);
            } else if (!value) {
                // this is necessary to not break for the single selection "required" behaviour
                input.value = '';
            }
        }

        this.props.onBlur && this.props.onBlur(event);
    }

    render() {
        const { label, ...autocompleteProps } = this.props;
        const { value, width, forceUpdateKey } = this.state;
        return (
            <InputWrapper>
                { label && <Label required={this.props.required}>{label}</Label> }
                <AutoComplete
                    key={forceUpdateKey}
                    dropdown
                    optionWidth={width}
                    { ...autocompleteProps }
                    onChange={this.onChange}
                    value={value}
                    innerRef={this.ref}
                    onBlur={this.onBlur}
                />
            </InputWrapper>
        );
    }
};

export default Autocomplete;

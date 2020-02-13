/* @flow */

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { MultiSelect as PrimeSelect } from 'primereact/components/multiselect/MultiSelect';

import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Label from 'app/components/molecules/Label/Label';

const MultiSelectStyled = styled(PrimeSelect)`
${({ fluid }) => fluid && 'width: 100% !important;'}
min-height: 2.63rem;
line-height: 2.2rem;
font-size: 1rem;
& .ui-multiselect-label-container {
    max-height: 32px;
}
`;

/**
 * A Stateful MultiSelect.
 */
class MultiSelect extends PureComponent<Object, Object> {

    static propTypes = PrimeSelect.propTypes;
    static defaultProps = {
        filter: true,
    }

    /**
     * @param props the Component's properties.
     */
    constructor(props: Object) {
        super(props);
        this.state = { value: props.initialValue };
    }

    componentDidUpdate(prevProps: Object) {
        const { initialValue } = this.props;
        if (initialValue !== prevProps.initialValue) {
            this.setState({ value: initialValue });
        }
    }

    onChange = ({ originalEvent, value }: Object) => {
        this.setState({ value }, () => {
            this.props.onChange && this.props.onChange({
                originalEvent,
                value,
                target: { name: this.props.name, value },
            });
        });
    };

    /**
     * @override
     */
    render() {
        const { label, required, fluid, filter, initialValue, ...restProps } = this.props;
        return (
            <InputWrapper>
                { label && <Label required={required}>{label}</Label> }
                <MultiSelectStyled
                    {...restProps}
                    value={this.state.value}
                    onChange={this.onChange}
                    fluid={fluid}
                    filter={filter}
                />
            </InputWrapper>);

    }
}

export default MultiSelect;

/* @flow */

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Immutable from 'app/utils/immutable/Immutable';
import Label from '../Label/Label';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';

const DaysWrapper = styled.div`
  display: flex;
`;
const Day = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: .5rem;
  &:first-child { padding-left:0; }
  &:last-child { padding-right: 0; }
`;
/**
 * A component to allow you to select days of the week via a row of checkboxes
 */
class DaySelectorRow extends PureComponent<Object, Object> {
    static propTypes = {
        label: PropTypes.string,
        onChange: PropTypes.func,
        repeatValueName: PropTypes.string,
        value: PropTypes.array
    };
    /**
     * Set our state
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            days: Immutable({
                Mo: false,
                Tu: false,
                We: false,
                Th: false,
                Fr: false,
                Sa: false,
                Su: false,
            })
        };
    }

    /**
     * Load data on Mount
     */
    componentDidMount() {
        this.setValuesFromProps();
    }

    /**
     * Re-render component
     * @param nextProps
     */
    /*componentWillReceiveProps(nextProps) {
        this.forceUpdate();
    }*/

    /**
     * Set our values from props
     */
    setValuesFromProps = () => {
        const valueObj = {};
        // eslint-disable-next-line no-return-assign
        this.props.value && this.props.value.map(val => valueObj[val] = true );
        this.setState({ days: valueObj });
    };
    /**
     * Update state and send on our selected values
     */
    setValues = (event: Object) => {
        const { name, value } = event.target;
        this.setState({ days: { ...this.state.days, [name]: value } }, this.onChange);
    };
    /**
     * On Change Event
     */
    onChange = () => {
        // console.log('State', this.state);
        if (this.props.onChange) {
            this.props.onChange(this.state.days);
        }
    };
    /**
     * Render our checkboxes
     */
    render() {
        // console.log('DaySelectorRowState', this.state);
        // console.log('DaySelectorRowProps', this.props);
        const { label } = this.props;
        return (
            <div>
                <Label>{label}</Label>
                <DaysWrapper>
                    <Day>
                        <Checkbox name="Mo" checked={this.state.days.Mo} onChange={this.setValues} />
                        <Label>Mo</Label>
                    </Day>
                    <Day>
                        <Checkbox name="Tu" checked={this.state.days.Tu} onChange={this.setValues} />
                        <Label>Tu</Label>
                    </Day>
                    <Day>
                        <Checkbox name="We" checked={this.state.days.We} onChange={this.setValues} />
                        <Label>We</Label>
                    </Day>
                    <Day>
                        <Checkbox name="Th" checked={this.state.days.Th} onChange={this.setValues} />
                        <Label>Th</Label>
                    </Day>
                    <Day>
                        <Checkbox name="Fr" checked={this.state.days.Fr} onChange={this.setValues} />
                        <Label>Fr</Label>
                    </Day>
                    <Day>
                        <Checkbox name="Sa" checked={this.state.days.Sa} onChange={this.setValues} />
                        <Label>Sa</Label>
                    </Day>
                    <Day>
                        <Checkbox name="Su" checked={this.state.days.Su} onChange={this.setValues} />
                        <Label>Su</Label>
                    </Day>
                </DaysWrapper>
            </div>
        );
    }
}

export default DaySelectorRow;

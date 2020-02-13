/* @flow */

import React, { PureComponent } from 'react';


/**
 *
 */
class StatefulInput extends PureComponent<Object, Object> {

    state: Object;

    constructor(props) {
        super(props);
        this.state = { value: props.value };
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;
        if (value !== prevProps.value && value !== this.state.value) {
            this.setState({ value });
        }
    }

    onChange = (event: Object) => {
        const { target, name, value } = event;
        if (name) {
            this.setState({ value });
        } else if (target && target.name) {
            this.setState({ value: target.value });
        }
        this.props.onChange(event);
    }

    render() {
        const { children, ...rest } = this.props;
        const Component = children;
        return <Component {...rest} value={this.state.value} onChange={this.onChange} />;
    }
}

export default (Component: Object) => (props: Object) => <StatefulInput {...props} children={Component} />;

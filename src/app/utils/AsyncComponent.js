/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';

/**
 * Create a component that we can use to code split and dynamically load using react router
 * @param importComponent
 * @returns {AsyncComponent}
 */
export default function asyncComponent(importComponent) {
    /**
     * Render our async component
     */
    class AsyncComponent extends Component<Object, Object> {
        /**
         * Set our initial state
         * @param props
         */
        constructor(props) {
            super(props);
            this.state = { component: null };
        }

        /**
         * Mount the component once this async component has mounted in the dom
         * @returns {Promise.<void>}
         */
        async componentDidMount() {
            const { default: component } = await importComponent();
            this.setState({ component });
        }

        /**
         * Render our async component
         * @returns {*}
         */
        render() {
            const C = this.state.component;
            return C ? <C {...this.props} /> : null;
        }
    }

    return AsyncComponent;
}

/* @flow */
import React, { Component } from 'react';

/**
 * Component for render react 16 errors
 */
class ErrorBoundary extends Component<Object, Object> {
    /**
     * Set default component state
     */
    constructor(props: Object) {
        super(props);
        this.state = { hasError: false };
    }

    /**
     * New R16. Catch error.
     */
    componentDidCatch(error: any, info: any) {
        // Display fallback UI
        this.setState({ hasError: true });
    }

    /**
     * Render our error
     * @returns {*}
     */
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h3>There as been an error loading the page. If the error persist contact your system administrator.</h3>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

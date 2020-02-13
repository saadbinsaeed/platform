/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tree as TreePrime } from 'primereact/components/tree/Tree';

/**
 *  Tree component for DATA
 */
class Tree extends PureComponent<Object, Object> {

    static propTypes = {
        value: PropTypes.array,
        selectionMode: PropTypes.string,
        selectionChange: PropTypes.func,
    }

    state = { key: 0 };

    componentDidUpdate(prevProps: Object) {
        if(prevProps.value !== this.props.value) {
            this.setState({ key: this.state.key + 1 });
        }
    }

    render() {
        const { value, selectionMode, selectionChange, children } = this.props;
        return (
            <TreePrime
                key={this.state.key}
                value={value}
                selectionMode={selectionMode}
                selectionChange={selectionChange}
            >
                { children }
            </TreePrime>
        );
    }
}

export default Tree;

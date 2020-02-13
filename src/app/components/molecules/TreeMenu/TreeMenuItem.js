/* @flow */

/**
 * Create a tree menu based on a list of items
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from 'app/components/atoms/Icon/Icon';
import TreeMenuChildren from './TreeMenuChildren';

const TreeMenuItemWrapper = styled.li`
    display: block;
    font-size: .9rem;
    display: block;
`;

const TreeMenuItemStyle = styled.div`
    display: flex;
    align-items: center;
    padding: .5rem;
    background-color: ${ ( { selected } ) => selected ? '' : '' };
`;

const TreeMenuIcon = styled(Icon)`
    margin: .5rem;
    transition: transform .3s ease-in-out;
    transform: rotate(${ ( { rotated } ) => rotated ? '90deg' : '0deg' });
`;

const TreeMenuIconDisabled = styled(TreeMenuIcon)`
    visibility: hidden;
    opacity: 0;
`;

/**
 * Our tree menu item is each item in the list
 */
class TreeMenuItem extends Component<Object, Object> {

    state: {
        open: boolean,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            open: !!props.open,
        };
        (this: Object).toggleChildren = this.toggleChildren.bind(this);
    }

    /**
     * Shoe/Hide the children.
     */
    toggleChildren() {
        this.setState({ open: !this.state.open });
        this.props.onToggle && this.props.onToggle();
    }

    /**
     * Render our tree menu
     */
    render() {
        const { open } = this.state;
        const { childTree, children } = this.props;
        return (
            <TreeMenuItemWrapper {...this.props}>
                <TreeMenuItemStyle {...this.props} selected={open}>
                    { (childTree || []).length > 0 ? <TreeMenuIcon rotated={open} name="arrow-right" size="sm" onClick={this.toggleChildren} /> : <TreeMenuIconDisabled name="arrow-right" size="sm" /> }
                    { children }
                </TreeMenuItemStyle>
                { childTree && <TreeMenuChildren show={open}>{childTree}</TreeMenuChildren> }
            </TreeMenuItemWrapper>
        );
    }
}

TreeMenuItem.propTypes = {
    children: PropTypes.node,
    childTree: PropTypes.node
};

export default TreeMenuItem;

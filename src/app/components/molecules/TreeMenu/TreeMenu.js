import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TreeMenuWrapper = styled.ul`
    display: flex;
    flex-direction: column;
    margin: 0; padding: 0;
`;

/**
 * Create a tree menu based on a list of items
 */
class TreeMenu extends Component<Object, Object> {
    /**
     * Render our tree menu
     */
    render() {
        return (<TreeMenuWrapper {...this.props}>{this.props.children}</TreeMenuWrapper>);
    }
}

TreeMenu.propTypes = {
    children: PropTypes.node
};

export default TreeMenu;
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TreeMenuLinkStyle = styled.a`
    display: flex;
    align-items: center;
    flex-grow: 1;
    color: ${ ( { selected, theme } ) => selected && theme ? theme.color.primary : theme.base.color } !important;
`;

/**
 * A link component for the tree menu
 */
class TreeMenuLink extends Component<Object, Object> {
    /**
     * Render our tree menu link and attach actions
     */
    render() {
        return (<TreeMenuLinkStyle {...this.props} selected={this.props.selected}>{this.props.children}</TreeMenuLinkStyle>);
    }
}

TreeMenuLink.propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool
};

export default TreeMenuLink;

/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Sidebar Style
const SideBarStyle = styled.aside`
   grid-area: ${ ( { rightbar } ) => rightbar ? 'rightbar' : 'sidebar' };
   display: ${ ( { opened } ) => opened ? 'block' : 'none' };
   background: ${( { theme } ) => theme.layout.navigation.background };
   box-shadow: ${( { theme } ) => theme.shadow.z1 };
   width: 260px;
   overflow-y: auto;
   position: absolute;
   top: 0; bottom: 0;
   z-index: 99;
   @media (min-width: ${( { theme } ) => theme.media.md} ) {
        width: ${( { theme } ) => theme.layout.navigation.width };
        position: relative;
   }
`;

/**
 * Crate our sidebar for the layout component
 */
class SideBar extends Component<Object, Object> {
    /**
   * Render our Layout SideBar Component
   */
    render (): Object {

        const { children, isOpened, isRightBar } = this.props;

        return (
            <SideBarStyle rightbar={isRightBar} className="LayoutSidebar" {...this.props} opened={isOpened}>
                {children}
            </SideBarStyle>
        );
    }
}

SideBar.propTypes = {
    isOpened: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};


export default SideBar;

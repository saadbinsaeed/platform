/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SideBar from './SideBar';
import Content from './Content';
import ActionBar from '../ActionBar/ActionBar';
import ButtonIcon from '../ButtonIcon/ButtonIcon';

const LayoutStyle = styled.section`
    grid-area: pContent;
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "sidebar content rightbar";
    overflow: auto;
`;

/**
 * Create our layout component to handle more strict functional inner layouts
 */
class Layout extends Component<Object, Object> {

    /**
     * Define our initial state
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            isLeftNavOpen: props.leftNavOpen || false,
            isRightNavOpen: props.rightNavOpen || false,
        };
    }

    componentDidUpdate(prevProps: Object) {
        const { leftNavOpen, rightNavOpen, isToggled } = this.props;

        if (prevProps.leftNavOpen !== leftNavOpen) {
            this.setState({ isLeftNavOpen: leftNavOpen });
        }
        if (prevProps.rightNavOpen !== rightNavOpen) {
            this.setState({ isRightNavOpen: rightNavOpen });
        }
        if (prevProps.isToggled !== isToggled) {
            this.toggleLeftNav();
        }
    }

    /**
     * Toggle the state of the left navigation
     */
    toggleLeftNav = () => {
        if (this.props.toggleLeftNav) {
            this.props.toggleLeftNav();
        } else {
            this.setState({
                isLeftNavOpen: !this.state.isLeftNavOpen,
            });
        }
    };

    /**
     * Toggle the state of the right navigation
     */
    toggleRightNav = () => {
        if (this.props.toggleRightNav) {
            this.props.toggleRightNav();
        } else {
            this.setState({
                isRightNavOpen: !this.state.isRightNavOpen,
            });
        }
    };

    /**
     * Open the state of the right navigation
     */
    openRightNav = () => {
        if (!this.state.toggledRightNav) {
            this.setState({
                isRightNavOpen: true,
            });
        }
    };

    /**
     * Render our layout container component
     */
    render() {
        const { className, leftSidebar, content, children, showToggle, noPadding, layoutStyle, rightSidebar } = this.props;

        const toggleLeftButton = <ButtonIcon icon="menu" iconColor="white" onClick={this.toggleLeftNav}/>;
        const toggleRightButton = <ButtonIcon icon="menu" iconColor="white" onClick={this.toggleRightNav}/>;
        const rightButton = rightSidebar ? toggleRightButton : toggleLeftButton;
        const leftButton = (rightSidebar && leftSidebar) ? toggleLeftButton : null;
        return (
            <LayoutStyle className={`${className || ''} Layout`} style={layoutStyle}>
                {
                    leftSidebar &&
                    <SideBar isOpened={this.state.isLeftNavOpen}>
                        {leftSidebar}
                    </SideBar>
                }
                <Content
                    header={showToggle && <ActionBar left={leftButton} right={rightButton} />}
                    showToggle={showToggle}
                    noPadding={noPadding}
                >
                    {content}
                    {children}
                </Content>
                {
                    rightSidebar &&
                    <SideBar isRightBar isOpened={this.state.isRightNavOpen}>
                        {rightSidebar}
                    </SideBar>
                }
            </LayoutStyle>
        );
    }
}

Layout.propTypes = {
    leftNavOpen: PropTypes.bool,
    showToggle: PropTypes.bool,
    noPadding: PropTypes.bool,
    content: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    leftSidebar: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default Layout;

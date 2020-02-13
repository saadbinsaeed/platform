/* @flow */
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Portal } from 'react-portal';
import PropTypes from 'prop-types';

import Title from 'app/components/atoms/Title/Title';
import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Immutable from 'app/utils/immutable/Immutable';
import { animateInRight, animateOutRight } from 'app/utils/styles/Animations';
import { ChildrenProp } from 'app/utils/propTypes/common';
import DrawerHeader from './DrawerHeader';

const DrawerStyle = styled.div`
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "drawerHeader"
      "drawerContent"
      "drawerFooter";
    position: fixed;
    right: 0;
    top: 0; bottom: 0;
    width: 100%;
    @media(min-width: ${({ theme }) => theme.media.md} ) {
        width: 310px;
    }
    z-index: 10;
    color: ${({ theme }) => theme.drawer.textColor};
    background: ${({ theme }) => theme.drawer.background};
    animation-name: ${( { isOpen } ) => isOpen ? animateInRight : animateOutRight};
    animation-duration: .3s;
    animation-timing-function: ease;
    overflow-y: auto;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;

const DrawerBlock = styled.div`
    grid-area: drawerContent;
    padding: ${({ drawerContentPadding }) => drawerContentPadding || '1rem' };
`;

const DrawerFooter = styled.footer`
    grid-area: drawerFooter;
    padding: 1rem;
`;

/**
 * A drawer component that can show hidden content by sliding in from the left, right or bottom;
 */
class Drawer extends PureComponent<Object, Object> {

    /**
     * Declare our propTypes
     */
    static propTypes = {
        children: ChildrenProp,
        footer: ChildrenProp,
        title: PropTypes.string,
        isOpen: PropTypes.bool,
        dispatch: PropTypes.any,
        position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
        isToggled: PropTypes.func,
        DrawerHeader: PropTypes.func,
    };

    static defaultProps = {
        DrawerHeader: null,
    };

    state: { data: Object };

    /**
     * Set our default state
     */
    constructor(props: Object) {
        super(props);
        this.state = { data: Immutable({ isOpen: this.props.isOpen || false }) };
    }

    /**
     * @param nextProps the properties that the Component is receiving.
     */
    componentWillReceiveProps(nextProps: Object) {
        this.setState({
            data: Immutable({
                ...this.state.data,
                isOpen: nextProps.isOpen,
            }),
        });
    }

    toggleDrawer = () => {
        this.setState({
            data: Immutable({
                ...this.state.data,
                isOpen: !this.state.data.isOpen,
            }),
        });
        if (this.props.isToggled) {
            this.props.isToggled();
        }
    };

    /**
     * Render our drawer component with it's children components
     */
    render(){
        const { children, position, title, footer, titleAs = 'h3', drawerContentPadding } = this.props;
        return (
            this.state.data.isOpen && <Portal node={document && document.getElementById('drawers')}>
                <DrawerStyle position={position} isOpen={this.state.data.isOpen}>
                    {this.props.DrawerHeader ? this.props.DrawerHeader({ title, titleAs, toggleDrawer: this.toggleDrawer, DrawerHeader }) : (<DrawerHeader>
                        <Title as={titleAs}>{title}</Title>
                        <HeaderActions>
                            <ButtonIcon icon="close" onClick={this.toggleDrawer} />
                        </HeaderActions>
                    </DrawerHeader>)}
                    <DrawerBlock drawerContentPadding={drawerContentPadding}>
                        {children}
                    </DrawerBlock>
                    <DrawerFooter>
                        {footer}
                    </DrawerFooter>
                </DrawerStyle>
            </Portal>
        );
    }
}


export default Drawer;

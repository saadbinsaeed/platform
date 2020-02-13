/* @flow */

/**
 * Popover component to show popup information attached to an element
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import TetherComponent from 'react-tether';
import enhanceWithClickOutside from 'react-click-outside';

import PopoverContainer from './Container/PopoverContainer';
import PopoverContainerProps from './Container/PopoverContainerProps';
import PopoverHeaderProps from './Header/PopoverHeaderProps';
import PopoverFooterProps from './Footer/PopoverFooterProps';
import PopoverContentProps from './Content/PopoverContentProps';


const PopoverLink = styled.div`
    display: inline-block;
    cursor: pointer;
    ${( { isOpen, theme } ) => isOpen && theme ? 'opacity: 0.8;' : ''};
`;


/**
 * Create a popover for elements that need to show more info
 */
class Popover extends Component<Object, Object> {

    static defaultProps = {
        placement: 'middle center'
    };

    static propTypes = {
        ...PopoverContainerProps,
        ...PopoverHeaderProps,
        ...PopoverContentProps,
        ...PopoverFooterProps
    };

    Layout = null;

    timeout = null;

    /**
     * Define our default state
     */
    constructor(props) {
        super(props);
        this.state = { isOpen: this.props.open };
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout); // fix memory leak
        }
    }

    /**
     * Close function
     */
    close =() => {
        this.setState({ isOpen: false });
    };

    /**
     * Toggle state of Popover
     */
    toggle =() => {
        this.setState({ isOpen: !this.state.isOpen });
    };


    handleClickOutside = () => {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.setState({ isOpen: false }), 300);
    };

    /**
     * Render our component
     */
    render() {
        const { children, width, content, placement } = this.props;
        const TetherComponentStyle = { zIndex: '9999' };
        return (
            <TetherComponent
                ref={(node) => { this.Layout = node; }}
                attachment={placement}
                constraints={[{ to: 'scrollParent', attachment: 'together' }]}
                style={TetherComponentStyle}
                onBlur={this.handleClickOutside}
            >
                { /* First child: This is what the item will be tethered to */ }
                <PopoverLink role="presentation" onClick={this.toggle} isOpen={this.state.isOpen}>{children}</PopoverLink>
                { /* Second child: If present, this item will be tethered to the the first child */ }
                <PopoverContainer placement={placement} isOpen={this.state.isOpen} content={content} width={width} />
            </TetherComponent>
        );
    }
}

export default enhanceWithClickOutside(Popover);

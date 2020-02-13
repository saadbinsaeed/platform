/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import styled, { css } from 'styled-components';

import { ChildrenProp } from 'app/utils/propTypes/common';

const Placements = css`
  position: absolute;
  ${({placement}) => placement === 'top right' ? `
            top:0; right: 0;
  ` : null}
  ${({ placement }) => placement === 'top left' ? `
            top:0; left: 0;
  ` : null}
  ${({ placement }) => placement === 'bottom left' ? `
            bottom:0; left: 0;
  ` : null}
  ${({ placement, customPosition }) => placement === 'bottom right' ?  (customPosition && customPosition) || `
            bottom:0; right:0;
  ` : null}
`;

const PopoverWrapper = styled.span`
  position: relative;
  ${({ fluid }) => fluid ? 'width: 100%;' : ''};
`;

const PopoverLink = styled.div`
    display: inline-block;
    cursor: pointer;
    ${({ fluid }) => fluid ? 'width: 100%;' : ''};
    ${( { isOpen, theme } ) => isOpen && theme ? 'opacity: 0.8;' : ''};
`;

const PopoverContainer = styled.div`
    ${Placements};
    position: absolute;
    text-align: left;
    color: ${ ( { theme } ) => theme.base.textColor };
    background: ${ ( { theme } ) => theme.widget.background };
    box-shadow: ${ ( { theme, shadow } ) => !shadow ? theme.shadow.z1 : '' };
    min-width: ${( { width } ) => width || 'auto'};
    ${( { padding } ) => padding ? 'padding: .1rem;' : ''};
    ${( { isOpen } ) => isOpen ? '' : 'display: none'};
    z-index: 999;
    ${({ nowrap }) => 'white-space: nowrap;'}
`;

/**
 * Dropdown
 */
class PopupMenu extends PureComponent<Object, Object> {
    /**
     * Set our prop-types
     */
    static propTypes = {
        inline: PropTypes.bool,
        right: PropTypes.bool,
        width: PropTypes.string,
        placement: PropTypes.string,
        children: ChildrenProp,
        content: ChildrenProp,
        layout: ChildrenProp,
        shadow: PropTypes.bool,
        nowrap: PropTypes.bool,
    };

    static defaultProps = {
        placement: 'top right',
        shadow: true,
        nowrap: false,
    };


    state = { isOpen: Boolean };
    unmounted = false;

    /**
     * Set our default state
     */
    constructor(props: Object) {
        super(props);
        this.state = { isOpen: false };
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    /**
     * Toggle our Dropdown state (open/closed)
     */
    toggle = (event: Object) => {
        event.preventDefault();
        this.setState({ isOpen: !this.state.isOpen });
    };

    /**
     * Close popup if outside is clicked;
     */
    handleClickOutside = () => {
        setTimeout(() => !this.unmounted && this.setState({ isOpen: false }), 300);
    };

    /**
     * Render our dropdown component
     */
    render() {
        const { children, content, width, placement, customPosition, className, shadow, nowrap, fluid, padding } = this.props;
        return (
            <PopoverWrapper fluid={fluid} onBlur={this.handleClickOutside} className={className}>
                { /* First child: This is what the item will be tethered to */ }
                <PopoverLink fluid={fluid} role="presentation" onClick={this.toggle} isOpen={this.state.isOpen}>{children}</PopoverLink>
                { /* Second child: If present, this item will be tethered to the the first child */ }
                <PopoverContainer
                    customPosition={customPosition}
                    placement={placement}
                    isOpen={this.state.isOpen}
                    onClick={this.toggle}
                    width={width}
                    shadow={shadow}
                    nowrap={nowrap}
                    padding={padding}
                >
                    {content}
                </PopoverContainer>
            </PopoverWrapper>
        );
    }
}
export default enhanceWithClickOutside(PopupMenu);

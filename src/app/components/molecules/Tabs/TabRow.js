/* eslint-disable no-trailing-spaces,no-unused-vars */
import React, { PureComponent } from 'react';
//import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';
import ScrollBarMin from 'app/utils/styles/ScrollMinStyle';
import { PRIORITY_COLOR_GRADIENT_MAP } from 'app/config/aboxConfig';

const TabRowStyle = styled.div`
    ${ScrollBarMin};
    grid-area: pTabs;
    display: block;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    text-align: center;
    background: ${( { color, theme } ) => color || theme.header.background };

    @media(min-width: ${ ( { theme } ) => theme.media.md }) {
       /*text-align: left;*/
    }
    margin: 0;
    height: ${ ( { theme } ) => theme.tabs.tabRow.height };
    border-bottom: solid 1px ${ ( { theme } ) => theme.base.borderColor };
`;

/**
 * Create the scrollable container for the tabs
 */
class TabRow extends PureComponent<Object, Object> {

    tabRow = React.createRef();

    /**
     * Define our propTypes
     */
    static propTypes = {
        children: ChildrenProp
    };

    elements = [];

    setActiveTab = (index) => {
        const row = this.tabRow.current;
        const element = this.elements[index];
        if (!element) {
            return;
        }
        const elementSize = element.getBoundingClientRect();

        let width = 0;
        for (let i = 0; i <= index; i++) {
            if (this.elements[i]) {
                width += this.elements[i].getBoundingClientRect().width;
            }
        }
        row.scrollLeft = width - (row.parentElement.getBoundingClientRect().width / 2) - (elementSize.width / 2);
    };

    register = (index, element) => {
        this.elements[index] = element;
    };

    /**
     * Render our tabs row with children
     */
    render() {
        const { color, ...rest } = this.props;
        const tabs = React.Children.map(this.props.children,
            (child, index) => child && React.cloneElement(child, {
                selectTab: () => { this.setActiveTab(index); },
                register: (element) => { this.register(index, element); }
            })
        );

        return (
            <TabRowStyle {...rest} color={color} className={'tabs'} innerRef={this.tabRow}>
                {tabs}
            </TabRowStyle>
        );
    }
}

export default TabRow;

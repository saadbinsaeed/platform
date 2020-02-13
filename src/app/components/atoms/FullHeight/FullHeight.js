/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';

const FullHeightWrapper = styled.div`
    display: block;
   ${ ( { withTabs, withFooter } ) => !withTabs && !withFooter ? 'height:100%;' : '' }
   ${ ( { theme, withTabs, withFooter } ) => withTabs && !withFooter ? `height:calc(100% - ${theme.tabs.tabRow.height});` : '' }
   ${ ( { theme, withTabs, withFooter } ) => !withTabs && withFooter ? `height:calc(100% - ${theme.bar.height});` : '' }
   ${ ( { theme, withTabs, withFooter } ) => withTabs && withFooter ? `height:calc(100% - (${theme.bar.height} + ${theme.tabs.tabRow.height}));` : '' }

   ${ ( { scrollY } ) => 'overflow-y:auto' || '' };

`;
/**
 * Component that let's you set a full height container
 */
class FullHeight extends Component<Object, Object> {
    /**
     * Set PropTypes
     */
    static propTypes = {
        withTabs: PropTypes.bool,
        withFooter: PropTypes.bool,
        scrollY: PropTypes.bool,
        children: ChildrenProp,
    };

    static defaultProps = {
        withTabs: false,
        withFooter: false
    };

    /**
     * Render our fullHeight container
     */
    render() {

        const { children, withTabs, withFooter, scrollY, ...rest } = this.props;

        return (
            <FullHeightWrapper withTabs={withTabs} withFooter={withFooter} scrollY={scrollY} className={'full-height'} {...rest}>
                {children}
            </FullHeightWrapper>
        );
    }
}


export default FullHeight;

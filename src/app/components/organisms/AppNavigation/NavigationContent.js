import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';
import ScrollBarMin from 'app/utils/styles/ScrollMinStyle';

const NavContentWrapper = styled.div`
    ${ScrollBarMin};
    flex: 1;
    color: ${({ theme }) => theme.navigation.content.text};
    font-weight: 300;
    overflow-x: hidden;
    overflow-y: auto;
    .block {
        display: block;
        border-top: solid 1px ${({ theme }) => theme.base.borderColor};
    }
    ${({ isLeftOpen }) => isLeftOpen ? 'width: 100%;' : 'width: 0;' };
`;
/**
 * Content for applications navigation
 */
class NavigationContent extends PureComponent<Object> {
    static propTypes = {
        children: ChildrenProp,
        isLeftOpen: PropTypes.bool
    };
    /**
     * Wrapper for each applications navigation content
     */
    render() {

        const { children, isLeftOpen } = this.props;

        return (
            <NavContentWrapper isLeftOpen={isLeftOpen}>{children}</NavContentWrapper>
        );
    }
}

export default NavigationContent;

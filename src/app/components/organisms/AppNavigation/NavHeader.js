import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';
import WidgetHeader from 'app/components/atoms/WidgetHeader/WidgetHeader';

const NavHeaderWrapper = styled(WidgetHeader)`
    color: ${({ theme }) => theme.navigation.content.text};
    font-weight: 500;
`;
/**
 * Content for applications navigation
 */
class NavHeader extends PureComponent<Object> {
    static propTypes = {
        children: ChildrenProp
    };
    /**
     * Wrapper for each applications navigation content
     */
    render() {

        const { children } = this.props;

        return (
            <NavHeaderWrapper>{children}</NavHeaderWrapper>
        );
    }
}

export default NavHeader;

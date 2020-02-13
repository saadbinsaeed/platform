/* @flow */
import React from 'react';
import styled from 'styled-components';

import WidgetHeader from 'app/components/atoms/WidgetHeader/WidgetHeader';
import { ChildrenProp } from 'app/utils/propTypes/common';

// STYLE IMPORTS
const MenuHeaderStyle = styled(WidgetHeader)`
  font-size: .9rem;
  color: rgba(255,255,255,0.8);
  border-bottom: solid 1px ${( { theme } ) => theme.base.borderColor };
`;

const MenuText = styled.div`
    flex: 1;
`;


const MenuHeader = (props: Object) => {

    const { children, ...rest } = props;

    return (
        <MenuHeaderStyle {...rest}>
            {children && (<MenuText>{children}</MenuText>) }
        </MenuHeaderStyle>
    );
};

MenuHeader.propTypes = {
    children: ChildrenProp,
};

export default MenuHeader;

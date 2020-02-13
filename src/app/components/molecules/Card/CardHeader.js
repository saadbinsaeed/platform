import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';

const CardHeaderStyle = styled.header`
   display: flex;
   align-items: center;
   justify-content: space-between;
   ${({ headerPadding }) => headerPadding ? 'padding: 1rem 1rem 1rem 1rem;' : ''}
   color: ${( { theme } ) => theme.widget.header.textColor };
   background: ${( { theme, headerColor } ) => headerColor || theme.widget.header.background };
   border-top-left-radius: ${( { theme } ) => theme.widget.borderRadius };
   border-top-right-radius: ${( { theme } ) => theme.widget.borderRadius };

   ${ ( { isCollapsed, theme } ) => isCollapsed && theme ? `
        border-bottom-left-radius: ${ theme.widget.borderRadius };
        border-bottom-right-radius: ${ theme.widget.borderRadius };` : ''
}
`;

const CardHeader = (props) => {

    const { children, isCollapsed, headerPadding, headerColor } = props;

    return (
        <CardHeaderStyle headerColor={headerColor} headerPadding={headerPadding} isCollapsed={isCollapsed} {...props}>
            {children}
        </CardHeaderStyle>
    );
};

CardHeader.propTypes = {
    children: ChildrenProp,
    isCollapsed: PropTypes.bool
};

export default CardHeader;

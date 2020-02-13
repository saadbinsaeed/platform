import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HeaderSummaryStyle = styled.div`
    display: block;
     @media (min-width: ${( { theme } ) => theme.media.md} ) {
       display: flex;
    }
    min-height: 29px;
`;

const HeaderSummary = ( props ) => {
    const { children } = props;
    return (
        <HeaderSummaryStyle {...props}>
            {children}
        </HeaderSummaryStyle>
    );
};

HeaderSummary.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default HeaderSummary;

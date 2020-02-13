/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HeaderSummaryItemStyle = styled.div`
    display: block;
    text-align: center;
    font-size: .9rem;
    padding: 1rem;
    @media (min-width: ${( { theme } ) => theme.media.md} ) {
        flex: 1;
        padding: .9rem;
    }
`;

const HeaderSummaryItem: Object = ( props: Object ): Object => {
    const { children } = props;
    return (
        <HeaderSummaryItemStyle {...props}>
            {children}
        </HeaderSummaryItemStyle>
    );

};

HeaderSummaryItem.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default HeaderSummaryItem;

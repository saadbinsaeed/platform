/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure, setPropTypes } from 'recompose';
import styled from 'styled-components';
// UI IMPORTS

// STYLE IMPORTS
const ItemRowStyle = styled.div`
    display: flex;
    flex-wrap: ${({ wrap }) => wrap ? 'wrap' : 'nowrap'};
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    margin: 0;
    list-style: none;
`;

const ItemRow = (props: Object) => {
    const { className, children, wrap } = props;
    return (
        <ItemRowStyle wrap={wrap ? 1 : 0} className={className}>
            {children}
        </ItemRowStyle>
    );
};

export default compose(
    pure,
    setPropTypes({
        children: PropTypes.any,
    })
)(ItemRow);

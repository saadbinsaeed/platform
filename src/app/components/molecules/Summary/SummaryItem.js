/* @flow */

import React from 'react';
import styled from 'styled-components';

const SummaryItemStyle = styled.div`
    display: block;
    padding: 1.3rem;
    text-align: center;
    background: ${( { theme } ) => theme.color.background };
    border-right: solid 1px rgba(0,0,0,0.1);
`;

const SummaryName = styled.h3`
    text-transform: uppercase;
    overflow: hidden;
    font-weight: 600;
    font-size: .9rem;
    color: ${( { theme } ) => theme.summary.nameColor };
    margin:0;
`;

const SummaryValue = styled.h4`
    font-weight: 300;
    font-size: .9rem;
    color: ${( { theme } ) => theme.summary.valueColor };
    margin:0;
`;

const SummaryItem: Object = ( props: Object ): Object => {
    // sometime the value can be a string, a boolean, a number
    // or an object that contains a property value
    let value = props.value;
    if (value && value.value) {
        value = value.value;
    }
    return (
        <SummaryItemStyle {...props}>
            <SummaryName {...props}>{props.displayName && String(props.displayName)}</SummaryName>
            <SummaryValue {...props}>{value && String(value)}</SummaryValue>
        </SummaryItemStyle>
    );
};

export default SummaryItem;

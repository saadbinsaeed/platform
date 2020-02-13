/* @flow */

import React from 'react';
import styled from 'styled-components';

const SummaryItemStyle = styled.div`
    display: block;
    text-align: center;
    border-right: solid 1px rgba(0, 0, 0, 0.1);
`;

const SummaryKey = styled.h3`
    text-transform: uppercase;
    overflow: hidden;
    font-weight: 400;
    font-size: 0.6rem;
    color: ${({ theme }) => theme.summary.nameColor};
    margin: 0;
`;

const SummaryValue = styled.h3`
    text-transform: uppercase;
    overflow: hidden;
    font-weight: 600;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.summary.nameColor};
    margin: 0;
`;

const ProcessCardSummaryItem = (props: Object) => {
    return (
        <SummaryItemStyle {...props}>
            <SummaryKey {...props}>{props.displayName.toString()}</SummaryKey>
            <SummaryValue {...props}>{props.value.toString()}</SummaryValue>
        </SummaryItemStyle>
    );
};

export default ProcessCardSummaryItem;

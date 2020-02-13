import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
    border-top: 1px solid transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.24);
    align-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.4px;
    line-height: 18px;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 0.4rem;
`;

const DashboardBreadcrumbs = ({ data }) => {
    const displayBreadcrumbs = data.length === 0 ? 'All' : data.map(option => `${option.name}: ${option.selectedOption.name}`).join(' / ');
    return (
        <StyledDiv>
            {displayBreadcrumbs}
        </StyledDiv>
    );
};

export default DashboardBreadcrumbs;

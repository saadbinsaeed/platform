/* @flow */

// $FlowFixMe
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import {
    ExpansionPanel as MuiExpansionPanel, ExpansionPanelDetails,
    ExpansionPanelSummary, Typography, MdiIcon
} from '@mic3/platform-ui';

const ExpansionPanelStyled = styled(MuiExpansionPanel)`
    max-height: inherit;
    width: 100%;
    margin: .5rem 0 !important;
`;

const ExpansionPanelDetailsColumn = styled(ExpansionPanelDetails)`
    flex-direction: column;
`;

const ExpansionPanelHOC = (props: Object) => {
    const [expanded, toggleExpanded] = useState(props.expanded);
    const onChange = useCallback((event) => {
        toggleExpanded(!expanded);
    }, [expanded]);
    return <ExpansionPanelStyled {...props} expanded={expanded} onChange={onChange} />;
};


const ExpansionPanel = ({ expanded, header, children }: Object) => (
    <ExpansionPanelHOC  expanded={expanded}>
        <ExpansionPanelSummary expandIcon={<MdiIcon name="chevron-down"/>}>
            <Typography variant="title">{header}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetailsColumn>
            {children}
        </ExpansionPanelDetailsColumn>
    </ExpansionPanelHOC>
);

export default ExpansionPanel;

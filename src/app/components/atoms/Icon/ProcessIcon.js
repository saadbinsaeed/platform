/* @flow */

import React from 'react';
import styled from 'styled-components';
import { pure } from 'recompose';

import Icon from 'app/components/atoms/Icon/Icon';
import { getPriorityColor } from 'app/config/aboxConfig';


const ProcessIconStyled = styled(Icon)`
    border-radius: 500rem;
    padding: 0.125rem 0.5rem;
    ${({ noMargin }) => noMargin ? '' : 'margin-right: 1rem !important;'}
    ${({ backgroundColor, theme }) => `background-color: ${theme.priorityColors[backgroundColor]};`}
`;

const ProcessIcon = ({ name, priority, disabled, ...rest }) => {
    const priorityColor = disabled ? 'disabled' : getPriorityColor(priority);
    return <ProcessIconStyled {...rest} name={name} backgroundColor={priorityColor}/>;
};

export default pure(ProcessIcon);

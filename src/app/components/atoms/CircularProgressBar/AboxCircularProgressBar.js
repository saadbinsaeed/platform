/* @flow */

import React from 'react';
import { withTheme } from 'styled-components';

import { getPriorityColor } from 'app/config/aboxConfig';
import CircularProgressBar from './CircularProgressBar';

const AboxCircularProgressBar = withTheme((props: Object) => {
    const { theme, priority, disabled } = props;
    const color = disabled ? theme.priorityColors['disabled'] : theme.priorityColors[getPriorityColor(priority)];

    return <CircularProgressBar {...props} color={color} />;
});

export default AboxCircularProgressBar;

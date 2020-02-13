/* @flow */

import React from 'react';
import { withTheme } from 'styled-components';

import { getPriorityColor } from 'app/config/aboxConfig';
import ProgressSlider from './ProgressSlider';

const AboxProgressSlider = withTheme((props: Object) => {
    const { theme, priority, disabled } = props;
    const color = disabled ? theme.priorityColors['disabled'] : theme.priorityColors[getPriorityColor(priority)];

    return <ProgressSlider {...props} fillColor={color} />;
});

export default AboxProgressSlider;

/* @flow */

import React from 'react';

import Icon from 'app/components/atoms/Icon/Icon';

/**
 * @public
 * Renders a button to show online/offline status
 */
const DeviceStatusRenderer = () => (
    <div>
        <Icon name="check-circle" size="lg" color="primary" />
        &nbsp;Online
    </div>
);

export default DeviceStatusRenderer;

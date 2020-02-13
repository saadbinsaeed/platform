/* @flow */
import React from 'react';
import { pure } from 'recompose';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';

/**
 * Abox Navigation Menu
 */
const BroadcastsMenu = ({ onClick }) => (
    <Menu className="block">
        <MenuItem onClick={onClick} name="Broadcasts" icon="signal-variant" to="/broadcasts" />
        <MenuItem onClick={onClick} name="Calendar" icon="calendar" to="/broadcasts/calendar" />
    </Menu>
);

export default pure(BroadcastsMenu);

/* @flow */
import React from 'react';
import { pure } from 'recompose';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';

/**
 * Abox Navigation Menu
 */
const DashboardsMenu = ({ onClick }) => (
    <Menu className="block">
        <MenuItem onClick={onClick} name="Dashboard" icon="dashboard" iconType="af" to="/dashboards" />
        <MenuItem onClick={onClick} name="Dashboard (BETA)" icon="dashboard" iconType="af" to="/dashboards_new" />
    </Menu> 
);

export default pure(DashboardsMenu);

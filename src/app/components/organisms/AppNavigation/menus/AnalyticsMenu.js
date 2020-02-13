/* @flow */
import React from 'react';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import { pure } from 'recompose';

/**
 * Abox Navigation Menu
 */
const AnalyticsMenu = ({ isAdmin, permissions, onClick }: Object) => {
    const permissionsSet = new Set(permissions);
    return (
        <Menu className="block">
            { (isAdmin || permissionsSet.has('intelligence.analytics.view')) && <MenuItem onClick={onClick} name="Analytics" iconType='af' icon="charts" to="/analytics" /> }
        </Menu>
    );
};

export default pure(AnalyticsMenu);

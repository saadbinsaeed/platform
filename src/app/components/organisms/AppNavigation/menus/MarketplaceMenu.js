/* @flow */
import React from 'react';
import { pure } from 'recompose';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';

/**
 * Abox Navigation Menu
 */
const MarketplaceMenu = ({ onClick }) => (
    <Menu className="block">
        <MenuItem onClick={onClick} name="Affectli Designer v1" icon="process-builder" iconType="af" to="/marketplace/designer" />
    </Menu>
);

export default pure(MarketplaceMenu);

/* @flow */
import React from 'react';
import { pure } from 'recompose';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';

/**
 * Abox Navigation Menu
 */
const AffectliMenu = () => (
    <Menu className="block">
        <MenuItem name="Affectli Version 1.5" />
        <MenuItem name="Support" />
    </Menu>
);

export default pure(AffectliMenu);

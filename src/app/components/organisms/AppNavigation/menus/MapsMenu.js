/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';

/**
 * Abox Navigation Menu
 */
const MapsMenu = ({ isAdmin, onClick }: Object): Object => (
    <Menu className="block">
        <MenuItem onClick={onClick} name="Situational Awareness" icon="situational-awareness" iconType="af" to="/legacy/maps" />
    </Menu>
);

MapsMenu.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
};

MapsMenu.defaultProps = {
    isAdmin: false,
};


export default pure(MapsMenu);

/* @flow */
import React from 'react';
import { pure } from 'recompose';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';

/**
 * Abox Navigation Menu
 */
const AboxMenu = (props: Object) => (
    <Menu className="block">
        <MenuItem onClick={props.onClick} name="Processes" icon="processes" iconType="af" to="/abox/processes" />
        <MenuItem onClick={props.onClick} name="Tasks" icon="task" iconType="af" to="/abox/tasks" />
        <MenuItem onClick={props.onClick} name="Calendar" icon="calendar-blank" to="/abox/calendar" />
        <MenuItem onClick={props.onClick} name="Timeline (Beta)" icon="projects" iconType="af" to="/abox/timeline" />
    </Menu>
);

export default pure(AboxMenu);

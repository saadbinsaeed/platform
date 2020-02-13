/* @flow */
import React from 'react';
import { pure } from 'recompose';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';

/**
 * Abox Navigation Menu
 */
const AdminMenu = ({ isAdmin, permissions, onClick }: Object) => {
    const permissionsSet = new Set(permissions);
    const canSeeUsers = isAdmin || permissionsSet.has('admin.user.view');
    const canSeeGroups = isAdmin || permissionsSet.has('admin.group.view');
    const canSeeSystemLogs = isAdmin || permissionsSet.has('admin.logs.view');
    return (
        <Menu className="block">
            { canSeeUsers && <MenuItem onClick={onClick} key="user" name="User Management" icon="user-management" iconType="af" to="/user-management" /> }
            { canSeeGroups && <MenuItem onClick={onClick} key="group" name={'Groups & Permissions'} icon="lock" to="/groups" /> }
            { canSeeSystemLogs && <MenuItem onClick={onClick} key="logs" name={'System Logs'} icon="code-not-equal" to="/logs" />}
        </Menu>
    );
};

export default pure(AdminMenu);

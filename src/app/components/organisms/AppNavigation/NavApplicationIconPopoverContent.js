/* @flow */

import React from 'react';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import affectliSso from 'app/auth/affectliSso';

const NavApplicationIconPopoverContent = (props: Object) => {
    const resource_access = affectliSso.getTokenParsed().resource_access;
    const content = [];
    if ((typeof resource_access != 'undefined' ) && ( resource_access != null)) {
        const keys = Object.keys(resource_access);
        const excludeKeys = [ 'realm-management', 'mi-stream', 'account', 'pentaho', 'broker', 'admin-cli', 'security-admin-console' ];
        keys.forEach((key) => {
            if (!excludeKeys.includes(key)) {
                content.push({
                    key:key,
                    name: key,
                    onClick: () => window.location.replace(`https://affectli.${key}`)
                });
            }
        });
    }
    return (
        <div>
            {content.map(({key, name, onClick}) => <MenuItem key={key} name={name} onClick={onClick && onClick}/>)}
        </div>
    );
};

export default NavApplicationIconPopoverContent;

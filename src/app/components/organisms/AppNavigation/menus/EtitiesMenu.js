/* @flow */
import React, { Fragment } from 'react';
import { pure } from 'recompose';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import Hr from 'app/components/atoms/Hr/Hr';

/**
 * Abox Navigation Menu
 */
const EtitiesMenu = ({ isAdmin, permissions, onClick }: Object) => {
    const permissionsSet = new Set(permissions);
    return (
        <Menu className="block">
            { (isAdmin || permissionsSet.has('entity.thing.view')) && <MenuItem onClick={onClick} name="Things" iconType="af" icon="Things" to="/things" /> }
            { (isAdmin || permissionsSet.has('entity.person.view')) && <MenuItem onClick={onClick} name="People" icon="people" iconType="af" to="/people" /> }
            { (isAdmin || permissionsSet.has('entity.organisation.view')) && <MenuItem onClick={onClick} name="Organisations" icon="organisations" iconType="af" to="/organisations" /> }
            { (isAdmin || permissionsSet.has('entity.custom.view')) && <MenuItem onClick={onClick} name="Custom Entities" icon="shape-circle-plus" to="/custom-entities" /> }
            { (isAdmin || permissionsSet.has('entity.classification.view')) && (
                <Fragment>
                    <Hr />
                    <MenuItem onClick={onClick} name="Classification Manager" icon="classification-editor" iconType="af" to="/classifications" />
                </Fragment>
            ) }
        </Menu>
    );
};

export default pure(EtitiesMenu);

/* @flow */
import React, { Fragment } from 'react';
import { pure } from 'recompose';

import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import Hr from 'app/components/atoms/Hr/Hr';

/**
 * Abox Navigation Menu
 */
const EventsMenu = ({ isAdmin, permissions, onClick }: Object) => {
    const permissionsSet = new Set(permissions);

    return (
        <Menu className="block">
            { (isAdmin || permissionsSet.has('mistream.events.view')) && <MenuItem onClick={onClick} name="Events Monitor" iconType='af' icon="event-monitor" to="/events" />}
            { (isAdmin || permissionsSet.has('mistream.main.view')) && <MenuItem onClick={onClick} name='Mi-Stream' iconType='af' icon='stream' to="/events/mi-stream" />}
            { isAdmin && window.location.href.includes('dev') &&
                <Fragment>
                    <MenuItem onClick={onClick} name="Dashboards" iconType='af' icon="dashboard" />
                    <Fragment>
                        <Hr />
                        <MenuItem onClick={onClick} name="AI" icon="lightbulb-on" />
                    </Fragment>
                </Fragment>
            }
        </Menu>
    );
};

export default pure(EventsMenu);

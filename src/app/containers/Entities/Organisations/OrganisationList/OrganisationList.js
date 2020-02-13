/* @flow */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';

import OrganisationsGrid from 'app/components/Entities/Organisations/OrganisationsGrid/OrganisationsGrid';
import PageTemplate from 'app/components/templates/PageTemplate';

/**
 * Renders the view to display the organisations.
 */
class OrganisationsListComponent extends PureComponent<Object, Object> {
    /**
     * @override
     */
    render(): Object {
        return (
            <PageTemplate title="Organisations">
                <OrganisationsGrid />
            </PageTemplate>
        );
    }
}

export const OrganisationsList = withRouter(OrganisationsListComponent);

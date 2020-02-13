/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { isModal } from 'app/utils/router/routerUtils';
import OrganisationsGrid from 'app/components/Entities/Organisations/OrganisationsGrid/OrganisationsGrid';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import OrganisationAddContainer from './OrganisationAdd/OrganisationAddContainer';
import OrganisationDetail from './OrganisationDetail/OrganisationDetail';
import ThingClassesAdd from '../../Common/ClassificationsTab/ClassificationsAddTab';
import EntityChildrenDrawer from 'app/components/organisms/EntityChildrenDrawer/EntityChildrenDrawer';
import AddRelationship from 'app/containers/Entities/Relationships/AddRelationship';
import AddRelationshipNew from 'app/containers/Entities/Relationships/AddRelationshipNew';
import EditRelationship from 'app/containers/Entities/Relationships/EditRelationship';
/**
 * Defines the routes for the Organisations views
 */
class OrganisationsRoute extends PureComponent<Object, Object> {

    static propTypes = {
        location: PropTypes.object,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string }),
        previousLocation: PropTypes.object,
        userProfile: PropTypes.object,
    };

    /**
     *
     */
    modalRouting(url) {
        return [
            <Route key="add" path={`${url}/add`} component={OrganisationAddContainer}/>,
            <Route
                key="add_relationship"
                path={`${url}/:entityId/relationships/:type2/add`}
                exact
                render={({ match: { params }, location }) => (<AddRelationship
                    {...params}
                    location={location}
                    type1={'organisation'}
                />)}
            />,
        ];

    }

    /**
     * @override
     */
    render() {
        const { match, location, previousLocation } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canView = isAdmin || permissionsSet.has('entity.organisation.view');
        if (!canView) {
            return <PageNotAllowed title="Organisations"/>;
        }
        return (
            <Fragment>
                <Switch>
                    <Route path={`${match.url}`} exact component={OrganisationsGrid}/>
                    <Route exact path={'/organisations/:id/classifications/add'}>
                        <ThingClassesAdd type="organisation"/>
                    </Route>
                    <Route
                        path={'/organisations/:entityId/relationships/add'}
                        render={({ match: { params = {} } }) => (<AddRelationshipNew
                            {...params}
                            baseUri={`/organisations/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                            type1={'organisation'}
                        />)}
                    />
                    <Route
                        path={'/organisations/:entityId/relationships/:type2/:id/edit'}
                        render={({ match: { params = {} } }) => (<EditRelationship
                            {...params}
                            baseUri={`/organisations/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                            type1={'organisation'}
                        />)}
                    />
                    {this.modalRouting(match.url)}
                    <Route path={`${match.url}/:id`} component={OrganisationDetail}/>
                </Switch>
                {isModal(location, previousLocation) && <Switch>{this.modalRouting(match.url)}</Switch>}
                <Route path={`${match.url}/:id`} component={EntityChildrenDrawer}/>
            </Fragment>
        );
    }
}

export default connect(
    (state: Object): Object => ({
        previousLocation: state.routing.previousLocation,
        userProfile: state.user.profile,
    }),
    null,
)(OrganisationsRoute);

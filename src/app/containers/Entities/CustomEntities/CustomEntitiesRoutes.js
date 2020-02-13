/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import { Switch, Route } from 'react-router-dom';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import CustomEntitesList from 'app/containers/Entities/CustomEntities/CustomEntitesList/CustomEntitesList';
import CustomEntityDetail from 'app/containers/Entities/CustomEntities/CustomEntityDetail/CustomEntityDetail';
import CustomEntityAddContainer from 'app/containers/Entities/CustomEntities/CustomEntityAdd/CustomEntityAddContainer';
import ClassificationsAddTab from 'app/containers/Common/ClassificationsTab/ClassificationsAddTab';
import EntityChildrenDrawer from 'app/components/organisms/EntityChildrenDrawer/EntityChildrenDrawer';
import AddRelationship from 'app/containers/Entities/Relationships/AddRelationship';
import { isModal } from 'app/utils/router/routerUtils';
import AddRelationshipNew from 'app/containers/Entities/Relationships/AddRelationshipNew';
import EditRelationship from 'app/containers/Entities/Relationships/EditRelationship';
/**
 * Defines the routes for the Custom Entities views
 */
class CustomEntitiesRoutes extends PureComponent<Object, Object> {
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
            <Route key="add" exact path={`${url}/add`} component={CustomEntityAddContainer}/>,
            <Route
                key="add_relationship"
                path={`${url}/:entityId/relationships/:type2/add`}
                exact
                render={({ match: { params }, location }) => (<AddRelationship
                    {...params}
                    location={location}
                    type1={'custom'}
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
        const canView = isAdmin || permissionsSet.has('entity.custom.view');

        if (!canView) {
            return <PageNotAllowed title="Custom Entities"/>;
        }
        return (
            <Fragment>
                <Switch>
                    <Route path={`${match.url}`} exact component={CustomEntitesList}/>
                    <Route exact path={'/custom-entities/:id/classifications/add'}>
                        <ClassificationsAddTab type="custom"/>
                    </Route>
                    <Route
                        path={'/custom-entities/:entityId/relationships/add'}
                        render={({ match: { params = {} } }) => (<AddRelationshipNew
                            {...params}
                            baseUri={`/custom-entities/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                            type1={'custom'}
                        />)}
                    />
                    <Route
                        path={'/custom-entities/:entityId/relationships/:type2/:id/edit'}
                        render={({ match: { params = {} } }) => (<EditRelationship
                            {...params}
                            baseUri={`/custom-entities/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                            type1={'custom'}
                        />)}
                    />
                    {this.modalRouting(match.url)}
                    <Route path={`${match.url}/:id`} component={CustomEntityDetail}/>
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
)(CustomEntitiesRoutes);

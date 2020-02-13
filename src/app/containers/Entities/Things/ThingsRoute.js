/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import ThingsList from 'app/containers/Entities/Things/ThingList/ThingsList';
import ThingAdd from 'app/containers/Entities/Things/ThingAdd/ThingAdd';
import ThingDetail from 'app/containers/Entities/Things/ThingDetail/ThingDetail';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { isModal } from 'app/utils/router/routerUtils';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import EntityChildrenDrawer from 'app/components/organisms/EntityChildrenDrawer/EntityChildrenDrawer';
import AddRelationship from 'app/containers/Entities/Relationships/AddRelationship';
import ClassificationsAddTab from 'app/containers/Common/ClassificationsTab/ClassificationsAddTab';
import AddRelationshipNew from 'app/containers/Entities/Relationships/AddRelationshipNew';
import EditRelationship from 'app/containers/Entities/Relationships/EditRelationship';

/**
 * Defines the routes for the Thing views
 */
class ThingsRoute extends PureComponent<Object, Object> {
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
            <Route key="add" exact path={`${url}/add`} component={ThingAdd}/>,
            <Route
                key="add_relationship"
                path={`${url}/:entityId/relationships/:type2/add`}
                exact
                render={({ match: { params }, location }) => (<AddRelationship
                    {...params}
                    location={location}
                    type1={'thing'}
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
        const canView = isAdmin || permissionsSet.has('entity.thing.view');
        if (!canView) {
            return <PageNotAllowed title="Things"/>;
        }
        return (
            <Fragment>
                <Switch>
                    <Route path={`${match.url}`} exact component={ThingsList}/>
                    <Route exact path={'/things/:id/classifications/add'}>
                        <ClassificationsAddTab type="thing"/>
                    </Route>
                    <Route
                        path={'/things/:entityId/relationships/add'}
                        render={({ match: { params = {} } }) => (<AddRelationshipNew
                            {...params}
                            baseUri={`/things/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                            type1={'thing'}
                        />)}
                    />
                    <Route
                        path={'/things/:entityId/relationships/:type2/:id/edit'}
                        render={({ match: { params = {} } }) => (<EditRelationship
                            {...params}
                            baseUri={`/things/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                            type1={'thing'}
                        />)}
                    />
                    {this.modalRouting(match.url)}
                    <Route path={`${match.url}/:id`} component={ThingDetail}/>
                </Switch>
                {isModal(location, previousLocation) && <Switch>{this.modalRouting(match.url)}</Switch>}
                <Route path={`${match.url}/:id`} component={EntityChildrenDrawer}/>
            </Fragment>
        );
    }
}

export default connect((state: Object): Object => ({
    previousLocation: state.routing.previousLocation,
    userProfile: state.user.profile,
}))(ThingsRoute);

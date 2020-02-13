/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { isModal } from 'app/utils/router/routerUtils';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';

import { PeopleList } from './PersonList/PersonList';
import PeopleDetail from './PersonDetail/PersonDetail';
import PersonAdd from './PersonAdd/PersonAdd';
import ThingClassesAdd from '../../Common/ClassificationsTab/ClassificationsAddTab';
import AddRelationship from 'app/containers/Entities/Relationships/AddRelationship';
import AddRelationshipNew from 'app/containers/Entities/Relationships/AddRelationshipNew';
import EditRelationship from 'app/containers/Entities/Relationships/EditRelationship';
/**
 * Defines the routes for the People views
 */
class PeopleRoute extends PureComponent<Object, Object> {

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
            <Route key="add" path={`${url}/add`} component={PersonAdd}/>,
            <Route
                key="add_relationship"
                path={`${url}/:entityId/relationships/:type2/add`}
                exact
                render={({ match: { params }, location }) => (<AddRelationship
                    {...params}
                    location={location}
                    type1={'person'}
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
        const canView = isAdmin || permissionsSet.has('entity.person.view');
        if (!canView) {
            return <PageNotAllowed title="People"/>;
        }
        return (
            <Fragment>
                <Switch>
                    <Route path={`${match.url}`} exact component={PeopleList}/>
                    <Route exact path={'/people/:id/classifications/add'}>
                        <ThingClassesAdd type="person"/>
                    </Route>
                    <Route
                        path={'/people/:entityId/relationships/add'}
                        render={({ match: { params = {} } }) => (<AddRelationshipNew
                            {...params}
                            baseUri={`/people/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                            type1={'person'}
                        />)}
                    />
                    <Route
                        path={'/people/:entityId/relationships/:type2/:id/edit'}
                        render={({ match: { params = {} } }) => (<EditRelationship
                            {...params}
                            baseUri={`/people/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                            type1={'person'}
                        />)}
                    />
                    {this.modalRouting(match.url)}
                    <Route path={`${match.url}/:id`} component={PeopleDetail}/>
                </Switch>
                {isModal(location, previousLocation) && <Switch>{this.modalRouting(match.url)}</Switch>}
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
)(PeopleRoute);

/* @flow */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { isModal, getLocation } from 'app/utils/router/routerUtils';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import GroupsAdd from './GroupsAdd';
import GroupsList from './GroupsList';
import GroupDetails from './Details/GroupDetails';
import GroupUsersAdd from './Details/GroupUsersAdd';
import GroupEntitiesAdd from './Details/GroupEntitiesAdd';
import GroupClassesAdd from './Details/GroupClassesAdd';


/**
 * Defines the routes for the Groups & Permissions views
 */
class GroupsRoute extends Component<Object, Object> {

    static propTypes = {
        location: PropTypes.object,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string }),
        previousLocation: PropTypes.object,
        userProfile: PropTypes.object,
    };

    /**
     * @override
     * Always make sure you use PageTemplate as PageContainer
     */
    render() {
        const { match, location, previousLocation } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canView = isAdmin || permissionsSet.has('admin.group.view');
        if (!canView) {
            return <PageNotAllowed title="Groups" />;
        }
        return (
            <Fragment>
                <Switch location={getLocation(location, previousLocation)}>
                    <Route path={`${ match.url }`} exact component={GroupsList} />
                    <Route path={`${ match.url }/add`} component={GroupsAdd} />
                    <Route path={`${ match.url }/:id`} exact component={GroupDetails} />
                    <Route path={`${ match.url }/:id/general`} component={GroupDetails} />
                    <Route path={`${ match.url }/:id/users`} exact component={GroupDetails} />
                    <Route path={`${ match.url }/:id/users/add`} component={GroupUsersAdd} />
                    <Route path={`${ match.url }/:id/entities`} exact component={GroupDetails} />
                    <Route path={`${ match.url }/:id/entities/:type`} exact component={GroupDetails} />
                    <Route path={`${ match.url }/:id/entities/:type/add`} component={GroupEntitiesAdd} />
                    <Route path={`${ match.url }/:id/permissions`} exact component={GroupDetails} />
                    <Route path={`${ match.url }/:id/history`} exact component={GroupDetails} />
                    <Route path={`${ match.url }/:id/classifications`} exact component={GroupDetails} />
                    <Route path={`${ match.url }/:id/classifications/add`} component={GroupClassesAdd} />
                </Switch>
                {isModal(location, previousLocation) ? <Route path={`${ match.url }/add`}><GroupsAdd /></Route> : null}
            </Fragment>
        );
    }
}

export default connect(
    (state: Object): Object => ({
        previousLocation: state.routing.previousLocation,
        userProfile: state.user.profile,
    }),
    null
)(withRouter( GroupsRoute ));

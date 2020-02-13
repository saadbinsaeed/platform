/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import Dashboard from 'app/containers/Dashboards_new/Dashboard';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';

/**
 * Defines the routes for the Classification views
 */
class DashboardsRoute extends Component<Object, Object> {

    static propTypes = {
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string }),
        userProfile: PropTypes.object,
    };

    /**
     * @override 
     */
    render() {
        const { match } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canView = isAdmin || permissionsSet.has('dashboard.view');
        if (!canView) {
            return <PageNotAllowed title="Dashboards (BETA)" />;
        }
        return (
            <Switch>
                <Route path={`${ match.url }`} exact component={Dashboard} />
            </Switch>
        );
    }
}

export default connect(
    (state: Object): Object => ({ userProfile: state.user.profile }),
    null
)(withRouter( DashboardsRoute ));

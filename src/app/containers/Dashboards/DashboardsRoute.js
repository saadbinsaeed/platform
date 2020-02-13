/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import Dashboard from 'app/containers/Dashboards/Dashboard';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import MemberOfTasks from 'app/containers/Dashboards/Lists/MemberOfTasks';
import MyOwnedTasks from 'app/containers/Dashboards/Lists/MyOwnedTasks';
import MyAssignedTasks from 'app/containers/Dashboards/Lists/MyAssignedTasks';
import MyDoneTasks from 'app/containers/Dashboards/Lists/MyDoneTasks';
import MyAssignedProcesses from 'app/containers/Dashboards/Lists/MyAssignedProcesses';
import MyOwnedProcesses from 'app/containers/Dashboards/Lists/MyOwnedProcesses';
import MemberOfProcesses from 'app/containers/Dashboards/Lists/MemberOfProcesses';
import MyDoneProcesses from 'app/containers/Dashboards/Lists/MyDoneProcesses';


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
            return <PageNotAllowed title="Dashboards" />;
        }
        return (
            <Switch>
                <Route path={`${ match.url }`} exact component={Dashboard} />
                <Route path={`${ match.url }/tasks/member`} exact component={MemberOfTasks} />
                <Route path={`${ match.url }/tasks/owned`} exact component={MyOwnedTasks} />
                <Route path={`${ match.url }/tasks/assigned`} exact component={MyAssignedTasks} />
                <Route path={`${ match.url }/tasks/done`} exact component={MyDoneTasks} />
                <Route path={`${ match.url }/processes/assigned`} exact component={MyAssignedProcesses} />
                <Route path={`${ match.url }/processes/member`} exact component={MemberOfProcesses} />
                <Route path={`${ match.url }/processes/owned`} exact component={MyOwnedProcesses} />
                <Route path={`${ match.url }/processes/done`} exact component={MyDoneProcesses} />
            </Switch>
        );
    }
}

export default connect(
    (state: Object): Object => ({ userProfile: state.user.profile }),
    null
)(withRouter( DashboardsRoute ));

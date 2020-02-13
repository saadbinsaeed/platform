/* @flow */

import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import Logs from 'app/containers/Admin/SystemLogs/Logs';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';

class LogsRoute extends Component<Object, Object> {

    static propTypes = {
        match: RouterMatchPropTypeBuilder(),
        userProfile: PropTypes.object
    };

    /**
     * @override
     */
    render() {
        const { match: { url } } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canView = isAdmin || permissionsSet.has('admin.logs.view');
        if (!canView) {
            return <PageNotAllowed title="System Logs" />;
        }
        return (
            <Fragment>
                <Switch>
                    <Route path={`${url}`} exact component={Logs} />
                </Switch>
            </Fragment>
        );
    }
}

export default connect(
    (state: Object): Object => ({
        userProfile: state.user.profile,
    }))(LogsRoute);

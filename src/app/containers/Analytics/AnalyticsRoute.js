/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import Chart from './Chart/Chart';
import PageNotAllowed from '../ErrorPages/PageNotAllowed';
/**
 * Defines the routes for the Classification views
 */
class AnalyticsRoute extends Component<Object, Object> {

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
        const canView = isAdmin || permissionsSet.has('intelligence.analytics.view'); //analitycs is
        if (!canView) {
            return <PageNotAllowed title="Affectli Intelligence" />;
        }
        return (
            <Switch>
                <Route path={`${ match.url }`} exact component={Chart} />
            </Switch>
        );
    }
}

export default connect(
    (state: Object): Object => ({
        userProfile: state.user.profile,
    })
)(AnalyticsRoute);

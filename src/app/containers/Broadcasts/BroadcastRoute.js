/* @flow */

// $FlowFixMe
import React, { Component, Fragment, lazy } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { isModal, getLocation } from 'app/utils/router/routerUtils';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import BroadcastList from 'app/containers/Broadcasts/BroadcastList';
import CreateBroadcast from 'app/containers/Broadcasts/CreateBroadcast';
import EditBroadcast from 'app/containers/Broadcasts/EditBroadcast';

import lazyComponent from 'app/utils/hoc/lazyComponent';
const BroadcastCalendar = lazyComponent(lazy(() => import('app/containers/Broadcasts/BroadcastCalendar')));

/**
 * Defines the routes for the Broadcasts views
 */
class BroadcastRoute extends Component<Object, Object> {

    static propTypes = {
        location: PropTypes.object,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string }),
        previousLocation: PropTypes.object,
        userProfile: PropTypes.object,
    };

    /**
     * @override
     */
    render() {
        const { match, location, previousLocation } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canView = isAdmin || permissionsSet.has('broadcast.view');
        if (!canView) {
            return <PageNotAllowed title="Broadcasts" />;
        }
        return (
            <Fragment>
                <Switch location={getLocation(location, previousLocation)}>
                    <Route path={`${ match.url }`} exact component={BroadcastList} />
                    <Route path={`${ match.url }/calendar`} component={BroadcastCalendar} />
                    <Route path={`${ match.url }/add`} component={CreateBroadcast} />
                    <Route path={`${ match.url }/edit/:id`} component={EditBroadcast} />
                </Switch>
                {
                    isModal(location, previousLocation) &&
                    <Switch>
                        <Route path={`${ match.url }/add`} component={CreateBroadcast} />
                        <Route path={`${ match.url }/edit/:id`} component={CreateBroadcast} />
                    </Switch>
                }
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
)(withRouter( BroadcastRoute ));

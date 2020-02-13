/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import EventsList from './EventsList/EventsList';
import Mistream from 'app/containers/Stream/Events/Mistream/Mistream';


const ValidatedRoute = pure((props: Object) => {
    const { title, canView, ...rest } = props;
    if (!canView) {
        return <PageNotAllowed title={title} />;
    }
    return <Route {...rest} />;
});

/**
 * Define the routes for the Event's views.
 */
class EventsRoute extends PureComponent<Object, Object> {
    static propTypes = {
        match: PropTypes.shape({
            url: PropTypes.string,
        }),
        userProfile: PropTypes.object
    };

    /**
     * @override
     */
    render() {
        const { match: { url } } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canViewEvents = isAdmin || permissionsSet.has('mistream.events.view');
        const canViewMistream = isAdmin || permissionsSet.has('mistream.main.view');
        return (
            <Switch>
                <ValidatedRoute path={`${url}/`} exact component={EventsList} title="Events" canView={canViewEvents} />
                <ValidatedRoute path={`${url}/mi-stream`} exact component={Mistream} title="Mi Stream" canView={canViewMistream} />
            </Switch>
        );
    }
}

export default connect(
    (state: Object): Object => ({ userProfile: state.user.profile }),
)(EventsRoute);

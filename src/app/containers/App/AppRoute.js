/* @flow */
import React, { PureComponent } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GlobalTemplate from 'app/components/templates/GlobalTemplate';
import Loader from 'app/components/atoms/Loader/Loader';
import { loadUserPreferences, loadUserProfile } from 'store/actions/admin/usersActions';
import AboxRoute from 'app/containers/Abox/AboxRoute';
// $FlowFixMe
import { routes as EventsRoute } from 'platform-mi-stream-module';

/**
 * AppRoute Container
 */
class AppRoute extends PureComponent<Object, Object> {
    static propTypes = {
        profile: PropTypes.object,
        loadingProfile: PropTypes.bool.isRequired,
        loadUserProfile: PropTypes.func.isRequired,
        preferences: PropTypes.object,
        loadingPreferences: PropTypes.bool.isRequired,
        loadUserPreferences: PropTypes.func.isRequired
    };

    timer;
    previousRequestTime: Object;
    state = { key: 1 };

    /**
     * @override
     */
    componentWillMount() {
        if (!this.props.preferences && !this.props.loadingPreferences) {
            this.props.loadUserPreferences();
        }
        if (!this.props.profile && !this.props.loadingProfile) {
            this.props.loadUserProfile();
        }
    }

    /**
     * @override
     */
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    reloadFullPage = () => this.setState({ key: this.state.key + 1 });

    /**
     * @override
     */
    render(): Object {
        const { profile, preferences } = this.props;
        if (!profile || !preferences) {
            return <Loader absolute />;
        }

        // eslint-disable-next-line no-restricted-globals
        const badUrl = location.href.split('?')[0].includes('=');
        return (
            <GlobalTemplate key={this.state.key}>
                <Switch>
                    {badUrl && <Redirect to="/abox/tasks" />}
                    <Redirect exact from="/" to="/abox/tasks" />
                    <Route path="/abox" component={AboxRoute} />
                    <Route path="/events" component={EventsRoute} />
                </Switch>
            </GlobalTemplate>
        );
    }
}

export default connect(
    state => ({
        loadingPreferences: state.user.loadingPreferences,
        preferences: state.user.preferences,
        loadingProfile: state.user.loadingProfile,
        profile: state.user.profile
    }),
    {
        loadUserPreferences,
        loadUserProfile
    }
)(AppRoute);

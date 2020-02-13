/* @flow */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';

import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { isModal, getLocation } from 'app/utils/router/routerUtils';
import ClassificationList from './ClassificationList/ClassificationList';
import ClassificationDetail from './ClassificationDetail/ClassificationDetail';
import ClassificationAddContainer from './ClassificationAdd/ClassificationAddContainer';

/**
 * Defines the routes for the Classification views
 */
class ClassificationsRoute extends Component<Object, Object> {

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
        const canView = isAdmin || permissionsSet.has('entity.classification.view');
        if (!canView) {
            return <PageNotAllowed title="Classifications" />;
        }
        return (
            <Fragment>
                <Switch location={getLocation(location, previousLocation)}>
                    <Route path={`${ match.url }`} exact component={ClassificationList} />
                    <Route path={`${ match.url }/add`} exact component={ClassificationAddContainer} />
                    <Route path={`${ match.url }/:id`} component={ClassificationDetail} />
                </Switch>
                {isModal(location, previousLocation) ? <Route path={`${ match.url }/add`} component={ClassificationAddContainer} /> : null}
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
)( withRouter( (ClassificationsRoute) ) );

/* @flow */
// $FlowFixMe
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import UserList from './UserList';
import UserAdd from './UserAdd';
import UserDetails from './Details/UserDetails';

const UserManagementRoute = memo((props: Object) => {
    const { permissions, isAdmin } = props.userProfile;
    const permissionsSet = new Set(permissions || []);
    const canView = isAdmin || permissionsSet.has('admin.user.view');
    if (!canView) {
        return <PageNotAllowed title="Users" />;
    }
    return (
        <Switch>
            <Route path={`/user-management`} exact component={UserList} />
            <Route path={`/user-management/add`} exact component={UserAdd} />
            <Route path={`/user-management/:id`} exact component={UserDetails}/>
            <Route path={`/user-management/:id/about`} component={UserDetails}/>
            <Route path={`/user-management/:id/history`} component={UserDetails}/>
        </Switch>
    );
});
UserManagementRoute.propTypes = {
    match: RouterMatchPropTypeBuilder({}),
    userProfile: PropTypes.object,
    isLoading: PropTypes.bool,
};

export default connect(
    (state: Object, ownProps: Object): Object => ({
        id: ownProps.match.params.id,
        userProfile: state.user.profile,
    })
)(withRouter(UserManagementRoute));

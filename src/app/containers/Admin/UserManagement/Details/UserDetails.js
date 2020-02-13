/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import PageTemplate from 'app/components/templates/PageTemplate';
import TabItem from 'app/components/molecules/Tabs/TabItem';
import TabRow from 'app/components/molecules/Tabs/TabRow';
import Loader from 'app/components/atoms/Loader/Loader';
import UserAbout from 'app/containers/Admin/UserManagement/Details/UserAbout';
import UserHistory from 'app/containers/Admin/UserManagement/Details/UserHistory';
import { loadUser, UPDATE_USER } from 'store/actions/admin/userManagementAction';
import { formatDate } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

/**
 * Defines the routes for User Management views
 */
class UserDetail extends PureComponent<Object, Object> {

    static propTypes = {
        match: RouterMatchPropTypeBuilder({}),
        userProfile: PropTypes.object,
        loadUser: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        isUpdateLoading: PropTypes.bool,
        lastActionError: PropTypes.bool,
        lastActionType: PropTypes.string,
        user: PropTypes.object,
    };

    actionTypes = [UPDATE_USER];

    constructor(props: Object) {
        super(props);
        props.id && props.loadUser(props.id);
    };

    componentDidUpdate(prevProps: Object) {
        const { lastActionError, lastActionType, id } = this.props;
        if ((prevProps.id !== id && id !== 'add') || (!lastActionError && this.actionTypes.includes(lastActionType))) {
            this.props.loadUser(id);
        }
    }

    @bind
    @memoize()
    buildInfo(createdDate: string, createdBy: string, modified: string, status: string) {
        return [
            { key: 'Created date', value: createdDate },
            { key: 'Created by', value: createdBy },
            { key: 'Last authenticated', value: modified },
            { key: 'Status', value: status },
        ];
    };

    render() {
        const { isLoading, user, id, isUpdateLoading } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canView = isAdmin || permissionsSet.has('admin.user.view');
        if (!canView) {
            return <PageNotAllowed title="Users" />;
        }
        const { active, createdBy, createdDate, lastUpdatedDate } = user || {};
        const status = active ? 'Active' : 'Inactive';

        const infoArray = this.buildInfo(formatDate(createdDate), String(get(createdBy, 'name')), formatDate(lastUpdatedDate), status);
        return (
            <Fragment>
                {(isLoading || isUpdateLoading) && <Loader absolute backdrop/>}
                {user && <PageTemplate title={get(user, 'name')} subTitle={` #${id} `} info={infoArray}>
                    <TabRow>
                        <TabItem label="About" to={`/user-management/${id}/about`}/>
                        <TabItem label="History" to={`/user-management/${id}/history`}/>
                    </TabRow>
                    <Switch>
                        <Route path={`/user-management/:id`} exact component={() => <Redirect to={`/user-management/${id}/about`}/>}/>
                        <Route path={`/user-management/:id/about`}>
                            <UserAbout user={user} location={this.props.location}/>
                        </Route>
                        <Route path={`/user-management/:id/history`}>
                            <UserHistory user={user}/>                            
                        </Route>
                    </Switch>

                </PageTemplate>}
            </Fragment>
        );
    }
}

export default connect(
    (state: Object, ownProps: Object): Object => ({
        id: ownProps.match.params.id,
        user: state.admin.users.details.data,
        isLoading: state.admin.users.details.isLoading,
        isUpdateLoading: state.admin.users.user.isLoading,
        userProfile: state.user.profile,
        lastActionType: state.global.lastActionType,
        lastActionError: state.global.lastActionError,
    }),
    { loadUser },
)(withRouter(UserDetail));

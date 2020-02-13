/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import TabItem from 'app/components/molecules/Tabs/TabItem';
import TabRow from 'app/components/molecules/Tabs/TabRow';
import GroupEntitiesTab from 'app/containers/Admin/GroupsAndPermissions/Details/Tabs/GroupEntitiesTab/GroupEntitiesTab';
import { loadGroup } from 'store/actions/admin/groupsActions';
import { formatDate } from 'app/utils/date/date';
import Loader from 'app/components/atoms/Loader/Loader';
import PageTemplate from 'app/components/templates/PageTemplate';
import GroupClassificationsTab from './Tabs/GroupClassificationsTab';
import GroupPermisionsTab from './Tabs/GroupPermisionsTab';
import GroupAboutTab from './Tabs/GroupAboutTab';
import GroupUsersTab from './Tabs/GroupUsersTab';
import GroupHistoryTab from './Tabs/GroupHistoryTab';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';

/**
 * Main container to display the details view of the Groups & Permissions
 */
class GroupDetails extends PureComponent<Object, Object> {
    static propTypes = {
        id: PropTypes.string.isRequired,
        group: PropTypes.object,
        loadGroup: PropTypes.func.isRequired,
        lastActionType: PropTypes.string,
        lastActionError: PropTypes.bool
    };

    /**
     * @override
     */
    componentDidMount() {
        const id = this.props.id;
        this.props.loadGroup(id);
    }

    buildInfo = memoize((createdBy: string, modified: string, status: string) => [
        { key: 'Created by', value: createdBy },
        { key: 'Last Modified', value: modified },
        { key: 'Status', value: status }
    ]);

    /**
     * @override
     */
    render() {
        const { group, isLoading, savingGroup, id } = this.props;
        if (!isLoading && !group && !savingGroup) {
            return <PageNotAllowed title={`Group. (ID:${id})`} />;
        }
        const { createdBy, createdDate, modifiedDate, active, name } = group || {};
        const created_by = `${createdBy ? `${createdBy.name} on` : ''} ${formatDate(createdDate)}`;
        const modified = formatDate(modifiedDate);
        const status = active ? 'Active' : 'Inactive';
        const infoArray = this.buildInfo(created_by, modified, status);

        return (
            <Fragment>
                {isLoading && <Loader absolute backdrop />}
                {group && (
                    <PageTemplate title={name} subTitle={`#${id}`} info={infoArray}>
                        <TabRow>
                            <TabItem label="About" to={`/groups/${id}/general`} />
                            <TabItem label="Users" to={`/groups/${id}/users`} />
                            <TabItem label="Entities" to={`/groups/${id}/entities`} />
                            <TabItem label="Classifications" to={`/groups/${id}/classifications`} />
                            <TabItem label="Group Permissions" to={`/groups/${id}/permissions`} />
                            <TabItem label="History" to={`/groups/${id}/history`} />
                        </TabRow>
                        <Switch>
                            <Route path={`/groups/:id`} exact component={() => <Redirect to={`/groups/${id}/general`} />} />
                            <Route path={'/groups/:id/general'} component={GroupAboutTab} />
                            <Route path={'/groups/:id/users'} component={GroupUsersTab} />
                            <Route path={'/groups/:id/entities'} exact component={() => <Redirect to={`/groups/${id}/entities/thing`} />} />
                            <Route path={`/groups/:id/entities/:type`} component={GroupEntitiesTab} />
                            <Route path={'/groups/:id/classifications'} component={GroupClassificationsTab} />
                            <Route path={'/groups/:id/permissions'} component={GroupPermisionsTab} />
                            <Route path={'/groups/:id/history'} render={() => <GroupHistoryTab id={id} />} />
                        </Switch>
                    </PageTemplate>
                )}
            </Fragment>
        );
    }
}

export default connect(
    (state: Object, ownProps: Object): Object => ({
        lastActionType: state.global.lastActionType,
        lastActionError: state.global.lastActionError,
        group: state.admin.groups.group.details,
        isLoading: state.admin.groups.group.isLoading,
        id: ownProps.match.params.id
    }),
    { loadGroup }
)(GroupDetails);

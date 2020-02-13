/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import {
    loadGroupUsers,
    removeGroupUser,
    ADD_GROUP_USERS,
    REMOVE_GROUP_USERS,
} from 'store/actions/admin/groupsActions';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import { GROUP_USERS_DATA_TABLE } from 'app/config/dataTableIds';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';

const ButtonStyle = styled.div`
  display: flex;
  justify-content: center;
`;

/**
 * Container that is used to display the Users tab of the Groups & Permissions details view.
 */
class GroupsUsersTab extends PureComponent<Object, Object> {

    static propTypes = {
        lastActionType: PropTypes.string,
        lastActionError: PropTypes.bool,
        removeGroupUser: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isDownloading: PropTypes.bool.isRequired,
        records: PropTypes.array,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
        loadGroupUsers: PropTypes.func.isRequired,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
        userProfile: PropTypes.object.isRequired,
    };

    columnDefinitions: Object[];

    key: number = 0;

    gridSettings: Object;

    canAdd: boolean;

    canEdit: boolean;

    /**
     * @param props the Component's properties
     */
    constructor(props) {
        super(props);

        this.gridSettings = {
            pageSize: 10,
            filters: {},
            sort: [{ field: 'user.name', order: 1 }],
            globalFilter: { value: '' },
        };
        const permissions = this.props.userProfile.permissions;
        const isAdmin = this.props.userProfile.isAdmin;
        const permissionsSet = new Set(permissions || []);
        this.canEdit = isAdmin || permissionsSet.has('admin.group.edit');
        this.canAdd = isAdmin || permissionsSet.has('admin.group.add');
        this.columnDefinitions = [
            { header: 'Name', field: 'user.name' },
            { header: 'User Login', field: 'user.login' },
        ];
        if (isAdmin) {
            this.columnDefinitions.push({
                header: 'Active',
                field: 'user.active',
                type: 'boolean',
                sortable: false,
                bodyComponent: BooleanRenderer,
                bodyComponentProps: { isTrue: value => value === true },
                renderValue: ({ value }) => value === true ? 'Active' : 'Inactive',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '100px', textAlign: 'center' },
            });
        }
        if (this.canEdit) {
            this.columnDefinitions.push({
                header: 'Action',
                field: 'id',
                bodyComponent: ({ value: id, data: { user } }) => id ? <ButtonStyle><ButtonIcon
                    style={{ color: 'white' }}
                    icon="delete"
                    onClick={() => { props.removeGroupUser(id, user.id); }}
                /></ButtonStyle> : null,
                style: { width: '80px' },
                filter: false,
                sortable: false,
                exportable: false,
            });
        }
    }

    /**
     * This function will be used to pass the query paramerts
     */
    loadRows = (options: Object) => {
        return this.props.loadGroupUsers(this.props.match.params.id, options, this.props.userProfile.isAdmin);
    };

    /**
     * @override
     */
    render() {
        const { lastActionError, lastActionType } = this.props;
        if (!lastActionError && [ADD_GROUP_USERS, REMOVE_GROUP_USERS].indexOf(lastActionType) >= 0) {
            ++this.key;
        }
        return (
            <Fragment>
                <ContentArea>
                    <DataTable
                        key={this.key}
                        dataTableId={GROUP_USERS_DATA_TABLE}
                        savePreferences={true}
                        gridSettings={this.gridSettings}
                        columnDefinitions={this.columnDefinitions}
                        loadRows={this.loadRows}
                        isLoading={this.props.isLoading}
                        isDownloading={this.props.isDownloading}
                        disableCountdown={true}
                        name="group_user"
                        value={this.props.records}
                        totalRecords={this.props.recordsCount}
                        countMax={this.props.recordsCountMax}
                        dataKey="user.login"
                        selectionMode="multiple"
                    />
                </ContentArea>
                <FooterBar>
                    {this.canEdit &&
                    <TextIcon icon="plus" label="Add" color="primary" to={`${this.props.match.url}/add`}/>}
                </FooterBar>
            </Fragment>
        );
    }
}

export default withRouter(connect(
    state => ({
        lastActionType: state.global.lastActionType,
        lastActionError: state.global.lastActionError,
        isLoading: state.admin.groups.users.isLoading,
        isDownloading: state.admin.groups.users.isDownloading,
        records: state.admin.groups.users.records,
        recordsCount: state.admin.groups.users.count,
        recordsCountMax: state.admin.groups.users.countMax,
        userProfile: state.user.profile,
    }),
    {
        loadGroupUsers,
        removeGroupUser,
    },
)(GroupsUsersTab));

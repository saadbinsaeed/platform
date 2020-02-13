/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DateRenderer from 'app/components/molecules/Grid/Renderers/Date/DateRenderer';
import { BROADCASTS_DATA_TABLE } from 'app/config/dataTableIds';
import PageTemplate from 'app/components/templates/PageTemplate';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import BroadcastEditRenderer from 'app/components/molecules/DataTable/Renderers/BroadcastEditRenderer';
import BroadcastParentRenderer from 'app/components/molecules/DataTable/Renderers/BroadcastParentRenderer';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { get } from 'app/utils/lo/lo';
import { fetchBroadcasts, fetchBroadcastMembers } from 'store/actions/broadcasts/broadcastsActions';

import BroadcastMembers from './BroadcastMembers';

/**
 * A component that displays a list of broadcasts
 */
class BroadcastsList extends PureComponent<Object, Object> {

    static propTypes = {
        fetchBroadcasts: PropTypes.func,
        isLoading: PropTypes.bool.isRequired,
        isDownloading: PropTypes.bool.isRequired,
        records: PropTypes.array,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
        userProfile: PropTypes.object,
    };

    static sumRecepients = ({ data }) => {
        const { users, groups } = data || {};
        const lengthOrZero = users => (users && users.length) || 0;
        let sum = lengthOrZero(users);
        groups && groups.map(({ users }) => sum += lengthOrZero(users));
        return sum;
    };

    // $FlowFixMe
    tableRef = React.createRef();
    permissions = this.props.userProfile.permissions;
    isAdmin = this.props.userProfile.isAdmin;
    permissionsSet = new Set(this.permissions || []);
    canEdit = this.isAdmin || this.permissionsSet.has('broadcast.edit');

    broadcastMembersTemplate = ({ id }) => {
        return <BroadcastMembers broadcastId={id} members={get(this.props, `members.${id}.data`)} isLoading={get(this.props, `members.${id}.isLoading`)} />;
    }

    columnDefinitions = [
        {
            field: '__none__',
            header: '',
            expander: true,
            exportable: false,
            filter: false,
            sortable: false,
            style: { width: '40px' },
        },
        {
            field: 'id',
            header: 'Broadcast ID',
            bodyComponent: !this.canEdit ? null : BroadcastEditRenderer,
            type: 'number',
            style: { width: '140px' }
        },
        {
            field: 'message',
            header: 'Broadcast',
        },
        {
            field: 'recipients',
            header: 'Recipients',
            filter: false,
            sortable: false,
            bodyComponent: BroadcastsList.sumRecepients,
            renderValue: BroadcastsList.sumRecepients,
            style: { width: '100px' }
        },
        {
            header: 'Active',
            field: 'active',
            type: 'boolean',
            sortable: false,
            bodyComponent: BooleanRenderer,
            renderValue: ({ value }) => (value ? 'Active' : 'Inactive'),
            options: [
                { label: 'All', value: '' },
                { label: 'Active', value: true },
                { label: 'Inactive', value: false },
            ],
            style: { width: '150px', textAlign: 'center' },
        },
        {
            field: 'parent.id',
            header: 'Parent ID',
            type: 'number',
            bodyComponent: !this.canEdit ? null : BroadcastParentRenderer,
            style: { width: '100px' }
        },
        {
            field: 'readStatus',
            header: 'Read Status',
            options: [{ label: 'Mixed', value: 'Mixed' }, { label: 'ALL READ', value: 'ALL READ' }],
            style: { width: '130px' }
        },
        {
            field: 'startDate',
            header: 'Start Time',
            type: 'date',
            body: ({startDate}) => <DateRenderer value={startDate} />,
        },
        {
            field: 'expireDate',
            header: 'Expiry Time',
            type: 'date',
            body: ({expireDate}) => <DateRenderer value={expireDate} />,
        },
    ];

    gridSettings = {
        pageSize: 10,
        filters: {},
        sort: [],
        globalFilter: { value: '' },
    };

    onRowExpand = ({ originalEvent, data }) => {
        const broadcastId = data.id;
        const isBroadcastLoading = get(this.props.memebers, `${String(broadcastId)}.isLoading`);
        if (broadcastId && !isBroadcastLoading) {
            this.props.fetchBroadcastMembers(broadcastId);
        }
    };

    /**
     * Render our broadcast list
     */
    render() {
        const { isLoading, isDownloading, records } = this.props;
        return (
            <PageTemplate title="Broadcasts">
                <ContentArea>
                    <DataTable
                        innerRef={this.tableRef}
                        dataTableId={BROADCASTS_DATA_TABLE}
                        savePreferences={true}
                        gridSettings={this.gridSettings}
                        columnDefinitions={this.columnDefinitions}
                        loadRows={this.props.fetchBroadcasts}
                        isLoading={isLoading}
                        isDownloading={isDownloading}
                        disableCountdown={true}
                        name="broadcast_list"
                        value={records}
                        totalRecords={this.props.recordsCount}
                        countMax={this.props.recordsCountMax}
                        rowExpansionTemplate={this.broadcastMembersTemplate}
                        now={Date.now()} // we need this to load the data (async) in the rowExpansionTemplate
                        onRowExpand={this.onRowExpand}
                        dataKey="id"
                        selectionMode="multiple"
                    />
                </ContentArea>
            </PageTemplate>
        );
    }
}

const mapStateToProps = (state, props) => ({
    isLoading: state.broadcasts.list.isLoading,
    isDownloading: state.broadcasts.list.isDownloading,
    records: state.broadcasts.list.records,
    recordsCount: state.broadcasts.list.count,
    recordsCountMax: state.broadcasts.list.countMax,
    userProfile: state.user.profile,
    members: state.broadcasts.members,
});

export default connect(
    mapStateToProps,
    { fetchBroadcasts, fetchBroadcastMembers }
)(BroadcastsList);

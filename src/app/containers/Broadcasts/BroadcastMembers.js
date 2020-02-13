/* @flow */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';

import Loader from 'app/components/atoms/Loader/Loader';
import List from 'app/components/molecules/List/List';
import ListItem from 'app/components/molecules/List/ListItem';
import { get } from 'app/utils/lo/lo';
import { expandBroadcastMembers } from 'store/actions/broadcasts/broadcastsActions';

/**
 * A component that displays a list of broadcasts
 */
class BroadcastMembers extends PureComponent<Object> {

    static propTypes = {
        broadcastId: PropTypes.number.isRequired,
        members: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
    };

    rowExpansionTemplate: Object;
    groupTemplate: Object;
    loaderWrapperStyle = { width: '50px', paddingTop: '5px' };

    /**
     * Set default state
     */
    constructor() {
        super();
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    }

    /**
     * Our sub template
     */
    rowExpansionTemplate(data: Object) {
        const users = data.users && data.users.length > 0 ? data.users : null;
        return users &&
            <List>
                {users.map(user => <ListItem key={user} title={user} />)}
            </List>
        ;
    }

    /**
     * Template for group name
     * @param rowData
     */
    groupTemplate = (data: Object) => `${data.gr_name || ''} (${(data.users || []).length})`;

    onRowToggle = ({ data }) => {
        this.props.expandBroadcastMembers(this.props.broadcastId, data);
    }

    /**
     * Render our broadcast list
     */
    render() {
        return (
            this.props.isLoading ?
                <div style={this.loaderWrapperStyle}><Loader radius="20" /> </div>:
                <DataTable
                    value={this.props.members || []}
                    expandedRows={this.props.expandedRows}
                    onRowToggle={this.onRowToggle}
                    rowExpansionTemplate={this.rowExpansionTemplate}
                >
                    <Column expander={true} style={{ width: '2rem' }} />
                    <Column field="gr_name" header="Recipients" body={this.groupTemplate} />
                </DataTable>
        );
    }
}

export default connect(
    (state: Object, props: Object) => ({
        expandedRows: get(state, `broadcasts.members.expandedRows.${props.broadcastId}`),
    }),
    { expandBroadcastMembers }
)(BroadcastMembers);

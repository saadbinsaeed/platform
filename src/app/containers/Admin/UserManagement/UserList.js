/* @flow */

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import memoize from 'fast-memoize';

import { USERS_DATA_TABLE } from 'app/config/dataTableIds';
import Loader from 'app/components/atoms/Loader/Loader';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import PageTemplate from 'app/components/templates/PageTemplate';
import Link from 'app/components/atoms/Link/Link';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import LabelListRenderer from 'app/components/molecules/Grid/Renderers/LabelListRenderer/LabelListRenderer';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import { get } from 'app/utils/lo/lo';
import { loadGroupDropdownOptions, loadOrganisationsDropdownForGrid } from 'store/actions/grid/gridActions';
import { loadUserManagement } from 'store/actions/admin/userManagementAction';

const UserLinkRenderer = (data: Object) => {
    if (!data.value) {
        return null;
    }
    return <Link to={`/user-management/${data.data.login}`}>{data.value}</Link>;
};

const columnIconRenderer: Function = ({ data }: Object ): ?Object => {
    if (!data) {
        return null;
    }
    return <Avatar size="lg" src={data.image} name={data.name || 'No Name'} />;
};

/**
 * Shows the user grid view.
 */
class UserManagementList extends PureComponent<Object, Object> {

    static propTypes = {
        loadUserManagement: PropTypes.func.isRequired,
        loadGroupDropdownOptions: PropTypes.func,
        loadOrganisationsDropdownForGrid: PropTypes.func,
        isLoading: PropTypes.bool.isRequired,
        isDownloading: PropTypes.bool.isRequired,
        records: PropTypes.array,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
        groupOptions: PropTypes.array,
        groupOptionsLoading: PropTypes.bool.isRequired,
        organisationOptions: PropTypes.array,
        organisationOptionsLoading: PropTypes.bool.isRequired,
    };
    static defaultProps = {};

    gridSettings = {
        pageSize: 10,
        filters: {},
        sort: [],
        globalFilter: { value: '' },
    };

    buildGroupOptions: Function;

    /**
     * componentDidMount - description
     *
     * @return {type}  description
     */
    componentDidMount() {
        const { groupOptions, groupOptionsLoading, organisationOptions, organisationOptionsLoading } = this.props;
        // We will not load dropdown again if its already been loaded
        if (!groupOptions && !groupOptionsLoading) {
            this.props.loadGroupDropdownOptions();
        }
        if (!organisationOptions.lenght && !organisationOptionsLoading) {
            this.props.loadOrganisationsDropdownForGrid();
        }
    }

    buildColumnDefinitions: Function = memoize((groupOptions, organisationOptions) => {
        const groupOptionsNormalized = (groupOptions || []).map(({ id, name }) => ({ value: id, label: name   }));
        const organizationOptionsNormalized = (organisationOptions || [])
            .filter(({ name }) => name)
            .map(({ id, name }) => ({ value: id, label: `${name} (${id})` }));

        return [
            { header: '', field: '__icon__', fixed:true, exportable: false, filter: false, sortable: false, style: { width: '50px' }, bodyComponent: columnIconRenderer, },
            { header: 'Display Name', field: 'name', bodyComponent: UserLinkRenderer },
            { header: 'Username', field: 'login' },
            { header: 'Email', field: 'partyId' },
            {
                header: 'Groups',
                field: 'groups.id',
                filterMatchMode: '=',
                type: 'number',
                bodyComponent: ({ data }) => <LabelListRenderer data={data} value={get(data, 'groups', [])} label="name" redirectTo={'group'}/>,
                renderValue: ({ data }) => (get(data, 'groups') || []).map(({ name }) => name).join(','),
                options: groupOptionsNormalized,
                sortable: false,
                style: { width: '300px' }
            },
            {
                header: 'Organisations',
                field: 'relations.organisation2.id',
                filterMatchMode: '=',
                type: 'number',
                bodyComponent: ({ data }) => <LabelListRenderer data={data} value={get(data, 'relations', [])} id="organisation2.id" label="organisation2.name" redirectTo={'organisation'} />,
                renderValue: ({ data }) => (get(data, 'relations') || []).map(({ organisation2 }) => organisation2 && organisation2.name ).filter(org => org !== null).join(','),
                options: organizationOptionsNormalized,
                sortable: false,
                style: { width: '300px' }
            },
            { header: 'Created', field: 'createdDate', type: 'date' },
            {
                header: 'Active',
                field: 'active',
                type: 'boolean',
                sortable: false,
                bodyComponent: BooleanRenderer,
                bodyComponentProps: { isTrue: value => value === true },
                renderValue: ({ value }) => value === true ? 'Active' : 'Inactive',
                options: [{ label: 'All', value: '' }, { label: 'Active', value: true }, { label: 'Inactive', value: false }],
                style: { width: '100px', textAlign: 'center' }
            },
            { header: 'Last Authenticated', field: 'lastUpdatedDate', type: 'date' }
        ];
    });

    /**
     * @override
     */
    render(): Object {
        const { groupsLoading, organisationsLoading, groupOptions, organisationOptions } = this.props;
        if (groupsLoading || organisationsLoading) {
            return <Loader radius="30" absolute />;
        }
        const columnDefinitions = this.buildColumnDefinitions(groupOptions, organisationOptions);
        return (
            <PageTemplate title={'User Management'}>
                <ContentArea>
                    <DataTable
                        dataTableId={USERS_DATA_TABLE}
                        savePreferences={true}
                        columnDefinitions={columnDefinitions}
                        loadRows={this.props.loadUserManagement}
                        gridSettings={this.gridSettings}
                        isLoading={this.props.isLoading}
                        isDownloading={this.props.isDownloading}
                        downloadAll={true}
                        disableCountdown={true}
                        name="user_list"
                        value={this.props.records}
                        totalRecords={this.props.recordsCount}
                        countMax={this.props.recordsCountMax}
                        dataKey="login"
                        selectionMode="multiple"
                    />
                </ContentArea>
            </PageTemplate>
        );
    }
}
export default connect(
    state => ( {
        groupOptionsLoading: state.grid.dropdowns.groups.isLoading,
        groupOptions: state.grid.dropdowns.groups.records,
        organisationOptionsLoading: state.grid.dropdowns.organisations.isLoading,
        organisationOptions: state.grid.dropdowns.organisations.records,
        isLoading: state.admin.users.userlist.isLoading,
        isDownloading: state.admin.users.userlist.isDownloading,
        records: state.admin.users.userlist.records,
        recordsCount: state.admin.users.userlist.count,
        recordsCountMax: state.admin.users.userlist.countMax,
    } ),
    {
        loadUserManagement,
        loadGroupDropdownOptions,
        loadOrganisationsDropdownForGrid
    }
)(UserManagementList);

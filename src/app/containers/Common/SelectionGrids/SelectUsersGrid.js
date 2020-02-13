/* @flow */

/**
 * Render a grid to select one or multiple Users.
 */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import memoize from 'fast-memoize';
import styled from 'styled-components';
import { groupUsersAddList, ADD_GROUP_USERS } from 'store/actions/admin/groupsActions';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import { get } from 'app/utils/lo/lo';
import { loadOrganisationsDropdownForGrid } from 'store/actions/grid/gridActions';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import Tag from 'app/components/atoms/Tag/Tag';

const StyledLink = styled(Link)`
    text-decoration: none;
`;

/**
 * Renders a grid to select one ore more Users.
 */
class SelectUsersGrid extends PureComponent<Object, Object> {
    static propTypes = {
        groupUsersAddList: PropTypes.func.isRequired,
        loadOrganisationsDropdownForGrid: PropTypes.func.isRequired,
        onSelectionChange: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
        organisationOptions: PropTypes.array,
        organisationOptionsLoading: PropTypes.bool,
        groupId: PropTypes.string.isRequired,
        lastActionType: PropTypes.string,
        lastActionError: PropTypes.bool,
        dataTableId: PropTypes.string,
        userProfile: PropTypes.object,
    };

    static defaultProps = {
        isLoading: false,
        organisationOptionsLoading: false,
        organisationOptions: [],
    };

    gridSettings: Object = {
        pageSize: 10,
        filters: {}, // {active: { value: true }} for this purpose column must be visible in grid
        sort: [{ field: 'name', order: 1 }],
        globalFilter: { value: '' },
    };

    /**
     * @param props the Component's properties
     */
    constructor(props) {
        super(props);

        this.state = {
            lastUpdateDate: Date.now(),
        };

        const { organisationOptions, organisationOptionsLoading } = props;
        if (!organisationOptions.length && !organisationOptionsLoading) {
            props.loadOrganisationsDropdownForGrid();
        }
    }

    /**
     * componentDidUpdate - description
     *
     * @param  {type} prevProps: Object description
     * @return {type}                   description
     */
    componentDidUpdate(prevProps: Object) {
        const { lastActionType, lastActionError } = this.props;
        if (
            this.props.entityType !== prevProps.entityType ||
            (!lastActionError && lastActionType === ADD_GROUP_USERS && lastActionType !== prevProps.lastActionType)
        ) {
            this.setState({ lastUpdateDate: Date.now() });
        }
    }

    /**
     *
     */
    buildColumnDefinitions: Function = memoize((organisationOptions, isAdmin) => {
        const organizationOptionsNormalized = (organisationOptions || [])
            .filter(({ name }) => name)
            .map(({ id, name }) => ({ value: id, label: `${name} (${id})` }));
        const columnDefinitions = [
            { header: 'User Name', field: 'name' },
            { header: 'User Login', field: 'login' },
        ];
        if (isAdmin) {
            columnDefinitions.push({
                header: 'Active',
                field: 'active',
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
        columnDefinitions.push({
            header: 'Organisations',
            field: 'organisation',
            queryFields: ['person.relationships.organisation1.id', 'person.relationships.organisation2.id'],
            filterMatchMode: '=',
            type: 'number',
            bodyComponent: ({ data }) => {
                const relationships = get(data, 'person.relationships', []);
                if (!relationships || !relationships.length) {
                    return null;
                }
                return relationships
                    .filter(r => r.organisation1 || r.organisation2)
                    .map((r, i) => {
                        const organisation = r.organisation1 || r.organisation2;
                        return (<Tag key={i} color={organisation.color}>
                            <StyledLink to={`/organisations/${organisation.id}`}>{organisation.name}</StyledLink>
                        </Tag>);
                    });
            },
            options: organizationOptionsNormalized,
            sortable: false,
            style: { width: '300px' },
        });
        return columnDefinitions;
    });

    /**
     * This function will keep track of the count of selected rows in a grid
     */
    onSelectionChange = (event: Object) => {
        this.props.onSelectionChange(event.data);
    };

    loadData = (options: Object) => {
        return this.props.groupUsersAddList(this.props.groupId, this.props.userProfile.isAdmin, options);
    };

    /**
     * @override
     */
    render() {
        return (
            <DataTable
                key={this.state.lastUpdateDate}
                dataTableId={this.props.dataTableId}
                savePreferences={true}
                gridSettings={this.gridSettings}
                columnDefinitions={this.buildColumnDefinitions(
                    this.props.organisationOptions,
                    this.props.userProfile.isAdmin,
                )}
                loadRows={this.loadData}
                isLoading={this.props.isLoading}
                disableExport
                disableCountdown
                value={this.props.records}
                countMax={this.props.recordsCountMax}
                totalRecords={this.props.recordsCount}
                dataKey={'login'}
                selectionMode="multiple"
                onSelectionChange={this.onSelectionChange}
            />
        );
    }
}

export default connect(
    state => ({
        isLoading: state.admin.groups.addUsersList.isLoading,
        records: state.admin.groups.addUsersList.records,
        recordsCount: state.admin.groups.addUsersList.count,
        recordsCountMax: state.admin.groups.addUsersList.countMax,
        organisationOptionsLoading: state.grid.dropdowns.organisations.isLoading,
        organisationOptions: state.grid.dropdowns.organisations.records,
        lastActionType: state.global.lastActionType,
        lastActionError: state.global.lastActionError,
        userProfile: state.user.profile,
    }),
    {
        groupUsersAddList,
        loadOrganisationsDropdownForGrid,
    },
)(SelectUsersGrid);

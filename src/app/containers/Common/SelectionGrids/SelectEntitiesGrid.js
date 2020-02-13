/* @flow */

/**
 * Render a grid to select one or multiple Users.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import { loadAvailableEntities, ADD_ENTITIES_TO_GROUP } from 'store/actions/admin/groupsActions';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import { loadClassificationsDropDownForGrid } from 'store/actions/grid/gridActions';
import ClassificationsRenderer
    from 'app/components/molecules/Grid/Renderers/ClassificationsRenderer/ClassificationsRenderer';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';

/**
 * Renders a grid to select one ore more Users.
 */
class SelectEntitiesGrid extends PureComponent<Object, Object> {
    static propTypes = {
        loadAvailableEntities: PropTypes.func.isRequired,
        onSelectionChanged: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        isDownloading: PropTypes.bool,
        records: PropTypes.array,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
        entityType: PropTypes.oneOf(['thing', 'person', 'organisation', 'custom', 'proc_def']).isRequired,
        groupId: PropTypes.string.isRequired,
        loadClassificationsDropDownForGrid: PropTypes.func.isRequired,
        classifications: PropTypes.array,
        classificationsLoading: PropTypes.bool,
        lastActionType: PropTypes.string,
        lastActionError: PropTypes.bool,
        dataTableId: PropTypes.string,
        userProfile: PropTypes.object,
    };

    static defaultProps = {
        isLoading: false,
        classificationsLoading: false,
    };

    columnDefinitions: Object[];

    gridSettings: Object;

    /**
     * constructor - description
     *
     * @param  {type} props description
     * @return {type}       description
     */
    constructor(props) {
        super(props);

        this.state = {
            lastUpdateDate: Date.now(),
        };

        this.gridSettings = {
            pageSize: 10,
            filters: {},
            sort: [],
            globalFilter: { value: '' },
        };
        if (props.entityType && props.entityType !== 'proc_def') {
            this.props.loadClassificationsDropDownForGrid({
                filterBy: [
                    { field: 'active', op: '=', value: true },
                    { field: 'applicableOn', op: '=', value: this.props.entityType },
                ],
            });
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
            (!lastActionError && lastActionType === ADD_ENTITIES_TO_GROUP && lastActionType !== prevProps.lastActionType)
        ) {
            this.setState({ lastUpdateDate: Date.now() });
        }
    }

    /**
     * onSelectionChanged - description
     *
     * @param  {type} event: Object description
     * @return {type}               description
     */
    onSelectionChanged = (event: Object) => {
        this.props.onSelectionChanged(event.data);
    };

    /**
     * This function will be used to pass the query paramerts
     */
    loadRows = (options: Object) => {
        return this.props.loadAvailableEntities(
            this.props.groupId,
            this.props.entityType,
            this.props.userProfile.isAdmin,
            options,
        );
    };

    buildColumnDefinitions = memoize((classifications, entityType, isAdmin) => {
        const columns = [
            {
                header: 'ID',
                field: 'id',
                type: entityType === 'proc_def' ? 'text' : 'number',
                style: { width: '320px' },
            },
            { header: 'Name', field: 'name', style: { width: '320px' } },
        ];

        if (isAdmin && entityType !== 'proc_def') {
            columns.push({
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
        if (entityType !== 'proc_def') {
            columns.push({
                header: 'Classification',
                field: 'classes.uri',
                sortable: false,
                filterMatchMode: '=',
                bodyComponent: props => <ClassificationsRenderer {...props} valueField="classes"
                    label={'name'}
                    redirectTo={entityType}
                />,
                renderValue: ({ value }) => (value || []).map(classification => classification).join(', '),
                options: (classifications || []).map(({ name, uri }) => ({ value: uri, label: name })),
                style: { width: '320px' },
            });
        }
        return columns;
    });

    /**
     * @override
     */
    render() {
        const { isLoading, classificationsLoading, classifications } = this.props;
        return (
            <DataTable
                key={this.state.lastUpdateDate}
                dataTableId={`${this.props.dataTableId}/${this.props.entityType}`}
                savePreferences={true}
                gridSettings={this.gridSettings}
                columnDefinitions={this.buildColumnDefinitions(
                    classifications,
                    this.props.entityType,
                    this.props.userProfile.isAdmin,
                )}
                loadRows={this.loadRows}
                isLoading={isLoading || classificationsLoading}
                name="select_entities"
                disableCountdown
                disableExport
                value={this.props.records}
                totalRecords={this.props.recordsCount}
                countMax={this.props.recordsCountMax}
                dataKey={'id'}
                selectionMode="multiple"
                onSelectionChange={this.onSelectionChanged}
            />
        );
    }
}

export default connect(
    state => ({
        isLoading: state.admin.groups.addEntitiesList.isLoading,
        records: state.admin.groups.addEntitiesList.records,
        recordsCount: state.admin.groups.addEntitiesList.count,
        recordsCountMax: state.admin.groups.addEntitiesList.countMax,
        classificationsLoading: state.grid.dropdowns.classifications.isLoading,
        classifications: state.grid.dropdowns.classifications.records,
        lastActionType: state.global.lastActionType,
        lastActionError: state.global.lastActionError,
        userProfile: state.user.profile,
    }),
    {
        loadAvailableEntities,
        loadClassificationsDropDownForGrid,
    },
)(SelectEntitiesGrid);

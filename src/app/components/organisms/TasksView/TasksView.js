/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { involvementConditions } from 'app/utils/static/filter-conditions';
import { loadTasks } from 'store/actions/abox/taskActions';
import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';
import { set } from 'app/utils/lo/lo';
import Filters from 'app/components/organisms/Filters/Filters';
import TasksViewItem from './TasksViewItem';
import VirtualListManaged from 'app/components/molecules/VirtualList/VirtualListManaged';

/**
 * View to display assigned task list
 */
class TasksView extends PureComponent<Object, Object> {

    /**
     * @const propTypes - describes the properties of the component
     * @const defaultProps - define the defaults values of the properties
     * @const filterDefinitions -definition for columns that we need to display in our grid
     */
    static propTypes = {
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        startIndex: PropTypes.number,
        totalRecords: PropTypes.number,
        loadTasks: PropTypes.func.isRequired,
        userProfile: PropTypes.object,
        setHeader: PropTypes.func,
    };

    static defaultProps = {
        isLoading: false,
        VirtualListProps: {},
        FiltersProps: {},
    };
    state = { deleted: {} };

    virtualListRef = React.createRef();

    searchBar = ['name', 'id'];
    defaultFilters = { status: 'is null', involvement: 'assignee' };
    defaultOrder = [{ field: 'taskStatus.lastUpdate', direction: 'desc' }];
    filterDefinitions: Array<Object> = [
        {
            field: 'assignee.id',
            type: 'userTypeahead',
            properties: {
                label: 'Assignee',
                name: 'assigneeId',
            },
            condition: '=',
        },
        {
            field: 'involvement',
            type: 'typeahead',
            properties: {
                label: 'My involvement',
                name: 'involvement',
                options: involvementConditions,
            },
            sort: false,
        },
        {
            field: 'name',
            type: 'text',
            properties: {
                label: 'Name',
                name: 'name'
            },
        },
        {
            field: 'id',
            type: 'text',
            properties: {
                label: 'ID',
                name: 'id'
            },
            condition: '=',
        },
        {
            field: 'endDate',
            type: 'typeahead',
            properties: {
                label: 'Status',
                name: 'status',
                options: [
                    { value: 'is null', label: 'Open' },
                    { value: 'is not null', label: 'Closed' },
                ],
            },
            sort: false
        },
        {
            field: 'priority',
            type: 'typeahead',
            properties: {
                label: 'Priority',
                name: 'priority',
                options: PRIORITY_OPTIONS,
            },
            condition: '='
        },
        {
            field: 'process.processDefinition.name',
            type: 'processTypeTypeahead',
            properties: {
                label: 'Process Type',
                name: 'processDefinitionName',
            },
            condition: '='
        },
        {
            field: 'startDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Created date',
                name: 'startDate',
            },
        },
        {
            field: 'bpmnVariables.startDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Start date',
                name: 'bpmnVariablesStartDate',
            },
        },
        {
            field: 'dueDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Due date',
                name: 'dueDate',
            },
        },
        {
            field: 'endDate',
            type: 'dateTimeRange',
            properties: {
                label: 'End date',
                name: 'endDate',
            },
        },
        {
            field: 'taskStatus.lastUpdate',
            type: 'dateTimeRange',
            properties: {
                label: 'Last updated date',
                name: 'taskStatusLastUpdate',
            },
        },
    ];

    @bind
    handleDelete(id) {
        this.setState({ deleted : set(this.state.deleted, id, true) }, this.forceUpdateGrid);
    };

    @bind
    renderComponent({ style, index, data }: Object) {
        const { deleted } = this.state;
        const id = data && data.id;
        return (
            <div style={style} key={index}>
                <TasksViewItem
                    data={data}
                    resetView={this.resetView}
                    isDeleted={id && deleted[id]}
                    handleDelete={this.handleDelete}
                />
            </div>
        );
    };

    @bind
    resetView() {
        this.virtualListRef.current && this.virtualListRef.current.resetView();
    };

    @bind
    forceUpdateGrid() {
        this.virtualListRef.current && this.virtualListRef.current.forceUpdate();
    };

    @bind
    @memoize()
    loadTasks(options) {
        const { activitiId, groups } = this.props.userProfile;
        const filterBy = [];
        (options.filterBy || []).forEach((filter) => {
            const { or, field, op, value } = filter;
            if (or) {
                filterBy.push(filter);
            } else if (field === 'involvement') {
                switch (value) {
                    case 'assignee':
                        filterBy.push({ field: 'assignee.activitiId', op: '=', value: activitiId });
                        break;
                    case 'owner':
                        filterBy.push({ field: 'owner.activitiId', op: '=', value: activitiId });
                        break;
                    case 'teamMember':
                        filterBy.push({ or: [
                            { field: 'teamMembers.user.activitiId', op: '=', value: activitiId },
                            { field: 'teamMembers.group.id', op: 'in', value: groups }
                        ]});
                        break;
                    default:
                }
            } else if (field.startsWith('bpmnVariables')) {
                const name = field.split('.')[1];
                filterBy.push(
                    { field: 'bpmnVariables.name', op: '=', value: name },
                    { field: 'bpmnVariables.text', op, value }
                );
            } else {
                filterBy.push(filter);
            }
        });
        if(this.props.loadData) {
            return this.props.loadData({ ...options, filterBy });
        }
        return this.props.loadTasks({ ...options, filterBy });
    }

    render() {
        const { FiltersProps, records, isLoading, totalRecords, startIndex, VirtualListProps, className } = this.props;
        const { itemCount } = VirtualListProps;
        const total = itemCount || totalRecords;
        return (
            <Filters
                filterDefinitions={this.filterDefinitions}
                searchBar={this.searchBar}
                defaultFilters={this.defaultFilters}
                defaultOrder={this.defaultOrder}
                className={className}
                {...FiltersProps}
            >
                {(filterBy, orderBy) => (
                    <VirtualListManaged
                        itemCount={totalRecords || 0}
                        itemSize={110}
                        isLoading={isLoading}
                        startIndex={startIndex || 0}
                        list={records}
                        maxWidth="1024"
                        title={`${total >= 1000 ? '999+' : total } Tasks`}
                        {...VirtualListProps}
                        loadData={this.loadTasks}
                        filterBy={filterBy}
                        orderBy={orderBy}
                        renderComponent={this.renderComponent}
                        ref={this.virtualListRef}
                    />
                )}
            </Filters>
        );
    }
}

export default connect(state => ({
    isLoading: state.abox.task.list.isLoading,
    startIndex: state.abox.task.list.startIndex,
    records: state.abox.task.list.records,
    totalRecords: state.abox.task.list.count,
    userProfile: state.user.profile,
}), {
    loadTasks,
})(TasksView);

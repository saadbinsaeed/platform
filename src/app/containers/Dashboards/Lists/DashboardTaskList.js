/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VirtualListManaged from 'app/components/molecules/VirtualList/VirtualListManaged';
import Filters from 'app/components/organisms/Filters/Filters';
import DashboardTaskListItem from 'app/components/Dashboard/DashboardTaskListItem';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';
import { setHeader } from 'store/actions/app/appActions';

/**
 * View to display assigned task list
 */
class DashboardTaskList extends PureComponent<Object, Object> {

    /**
     * @const propTypes - describes the properties of the component
     * @const defaultProps - define the defaults values of the properties
     * @const filterDefinitions -definition for columns that we need to display in our grid
     */
    static propTypes = {
        loadData: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        startIndex: PropTypes.number,
        totalRecords: PropTypes.number,
        userProfile: PropTypes.object,
        setHeader: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isLoading: false
    };


    componentDidMount() {
        this.props.setHeader({ title: this.props.title });
    }

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
                label: 'Start Date',
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

    searchBar = ['name', 'id'];
    defaultOrder = [{ field: 'startDate', direction: 'desc' }];

    renderComponent = (props: Object) => <DashboardTaskListItem key={props.index} {...props} />

    @bind
    @memoize()
    buildId(title: String) {
        return `DashboardTaskList_${(title || '').replace(/\W/g, '') || 'default'}`;
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex, loadData, title } = this.props;
        return (
            <Filters
                id={this.buildId(title)}
                filterDefinitions={this.filterDefinitions}
                defaultOrder={this.defaultOrder}
                searchBar={this.searchBar}
            >
                {(filterBy, orderBy) => (
                    <VirtualListManaged
                        renderComponent={this.renderComponent}
                        itemSize={178}
                        itemCount={totalRecords || 0}
                        loadData={loadData}
                        isLoading={isLoading}
                        startIndex={startIndex || 0}
                        filterBy={filterBy}
                        orderBy={orderBy}
                        list={records}
                        maxWidth="1024"
                        title={`${totalRecords >= 1000 ? '999+' : totalRecords } Tasks`}
                    />
                )}
            </Filters>
        );
    }
}

export default connect(
    null,
    {
        setHeader,
    }
)(DashboardTaskList);

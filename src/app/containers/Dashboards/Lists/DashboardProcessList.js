/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VirtualListManaged from 'app/components/molecules/VirtualList/VirtualListManaged';
import Filters from 'app/components/organisms/Filters/Filters';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { setHeader } from 'store/actions/app/appActions';
import DashboardProcessListItem from 'app/components/Dashboard/DashboardProcessListItem';

/**
 * View to display assigned task list
 */
class DashboardProcessList extends PureComponent<Object, Object> {

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
            field: 'createdBy.id',
            type: 'userTypeahead',
            properties: {
                label: 'Created by',
                name: 'createdById',
            },
            condition: '=',
        },
        {
            field: 'createDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Created date',
                name: 'createDate',
            },
        },
        {
            field: 'status.lastUpdate',
            type: 'dateTimeRange',
            properties: {
                label: 'Last updated date',
                name: 'statusLastUpdate',
            },
        },
    ];

    searchBar = ['name', 'id'];
    defaultOrder = [{field: 'createDate', direction: 'desc'}];
    renderComponent = (props: Object) => <DashboardProcessListItem key={props.index} {...props} />

    @bind
    @memoize()
    buildId(title: String) {
        return `DashboardProcessList_${(title || '').replace(/\W/g, '') || 'default'}`;
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex, loadData, title, orderBy } = this.props;
        return (
            <Filters
                id={this.buildId(title)}
                filterDefinitions={this.filterDefinitions}
                searchBar={this.searchBar}
                defaultOrder={orderBy || this.defaultOrder}
            >
                {(filterBy, orderBy) => (
                    <VirtualListManaged
                        renderComponent={this.renderComponent}
                        itemSize={167}
                        itemCount={totalRecords || 0}
                        loadData={loadData}
                        isLoading={isLoading}
                        startIndex={startIndex || 0}
                        filterBy={filterBy}
                        orderBy={orderBy}
                        list={records}
                        maxWidth="1024"
                        title={`${totalRecords >= 1000 ? '999+' : totalRecords } Processes`}
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
)(DashboardProcessList);

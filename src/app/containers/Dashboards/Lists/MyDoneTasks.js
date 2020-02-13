/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTasksDone } from 'store/actions/dashboard/dashboardActions';
import DashboardTaskList from './DashboardTaskList';

/**
 * View to display assigned task list
 */
class MyDoneTasks extends PureComponent<Object, Object> {

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
        loadTasksDone: PropTypes.func.isRequired,
    };

    loadData = (options: Object) => {
        const { loadTasksDone } = this.props;
        return loadTasksDone(options);
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex } = this.props;
        return (
            <DashboardTaskList
                loadData={this.loadData}
                title="My Done Tasks"
                {...{ records, isLoading, totalRecords, startIndex }}
            />
        );
    }
}

export default connect(state => ({
    isLoading: state.dashboard.tasksDone.isLoading,
    records: state.dashboard.tasksDone.records,
    startIndex: state.dashboard.tasksDone.startIndex,
    totalRecords: state.dashboard.tasksDone.count,
}), {
    loadTasksDone,
})(MyDoneTasks);

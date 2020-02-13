/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTasksOwned } from 'store/actions/dashboard/dashboardActions';
import DashboardTaskList from './DashboardTaskList';

/**
 * View to display assigned task list
 */
class MyOwnedTasks extends PureComponent<Object, Object> {

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
        loadTasksOwned: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    };

    loadData = (options: Object) => {
        const { user, loadTasksOwned } = this.props;
        return loadTasksOwned(user, options);
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex } = this.props;
        return (
            <DashboardTaskList
                loadData={this.loadData}
                title="My Owned Tasks"
                {...{ records, isLoading, totalRecords, startIndex }}
            />
        );
    }
}

export default connect(state => ({
    isLoading: state.dashboard.tasksOwned.isLoading,
    records: state.dashboard.tasksOwned.records,
    startIndex: state.dashboard.tasksOwned.startIndex,
    totalRecords: state.dashboard.tasksOwned.count,
    user: state.user.profile,
}), {
    loadTasksOwned,
})(MyOwnedTasks);

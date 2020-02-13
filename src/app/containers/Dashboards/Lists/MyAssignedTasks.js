/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTasksAssigned } from 'store/actions/dashboard/dashboardActions';
import DashboardTaskList from './DashboardTaskList';

/**
 * View to display assigned task list
 */
class MyAssignedTasks extends PureComponent<Object, Object> {

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
        loadTasksAssigned: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    };

    loadData = (options: Object) => {
        const { user, loadTasksAssigned } = this.props;
        return loadTasksAssigned(user, options);
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex } = this.props;
        return (
            <DashboardTaskList
                loadData={this.loadData}
                title="My Assigned Tasks"
                {...{ records, isLoading, totalRecords, startIndex }}
            />
        );
    }
}

export default connect(state => ({
    isLoading: state.dashboard.tasksAssigned.isLoading,
    records: state.dashboard.tasksAssigned.records,
    startIndex: state.dashboard.tasksAssigned.startIndex,
    totalRecords: state.dashboard.tasksAssigned.count,
    user: state.user.profile,
}), {
    loadTasksAssigned,
})(MyAssignedTasks);

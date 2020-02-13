/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadProcessesAssigned } from 'store/actions/dashboard/dashboardActions';
import DashboardProcessList from './DashboardProcessList';

/**
 * View to display assigned task list
 */
class MyAssignedProcesses extends PureComponent<Object, Object> {

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
        loadProcessesAssigned: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    };

    loadData = (options: Object) => {
        const { user, loadProcessesAssigned } = this.props;
        return loadProcessesAssigned(user, options);
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex } = this.props;
        return (
            <DashboardProcessList
                loadData={this.loadData}
                title="My Assigned Processes"
                {...{ records, isLoading, totalRecords, startIndex }}
            />
        );
    }
}

export default connect(state => ({
    isLoading: state.dashboard.processesAssigned.isLoading,
    records: state.dashboard.processesAssigned.records,
    startIndex: state.dashboard.processesAssigned.startIndex,
    totalRecords: state.dashboard.processesAssigned.count,
    user: state.user.profile,
}), {
    loadProcessesAssigned,
})(MyAssignedProcesses);

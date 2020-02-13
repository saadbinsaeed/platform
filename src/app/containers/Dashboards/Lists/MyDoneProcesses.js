/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadProcessesDone } from 'store/actions/dashboard/dashboardActions';
import DashboardProcessList from './DashboardProcessList';

/**
 * View to display Done task list
 */
class MyDoneProcesses extends PureComponent<Object, Object> {

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
        loadProcessesDone: PropTypes.func.isRequired,
        userProfile: PropTypes.object,
    };
    defaultOrder = [{field: 'endDate', direction: 'desc'}];
    loadData = (options: Object) => {
        const { userId, loadProcessesDone } = this.props;
        return loadProcessesDone(userId, options);
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex } = this.props;
        return (
            <DashboardProcessList
                loadData={this.loadData}
                title="My Done Processes"
                orderBy={this.defaultOrder}
                {...{ records, isLoading, totalRecords, startIndex }}
            />
        );
    }
}

export default connect(state => ({
    isLoading: state.dashboard.processesDone.isLoading,
    records: state.dashboard.processesDone.records,
    startIndex: state.dashboard.processesDone.startIndex,
    totalRecords: state.dashboard.processesDone.count,
    userId: state.user.profile.id,
}), {
    loadProcessesDone,
})(MyDoneProcesses);

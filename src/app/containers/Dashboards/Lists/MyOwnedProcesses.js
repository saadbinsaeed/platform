/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadProcessesOwned } from 'store/actions/dashboard/dashboardActions';
import DashboardProcessList from './DashboardProcessList';

/**
 * View to display Owned task list
 */
class MyOwnedProcesses extends PureComponent<Object, Object> {

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
        loadProcessesOwned: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    };

    loadData = (options: Object) => {
        const { user, loadProcessesOwned } = this.props;
        return loadProcessesOwned(user, options);
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex } = this.props;
        return (
            <DashboardProcessList
                loadData={this.loadData}
                title="My Owned Processes"
                {...{ records, isLoading, totalRecords, startIndex }}
            />
        );
    }
}

export default connect(state => ({
    isLoading: state.dashboard.processesOwned.isLoading,
    records: state.dashboard.processesOwned.records,
    startIndex: state.dashboard.processesOwned.startIndex,
    totalRecords: state.dashboard.processesOwned.count,
    user: state.user.profile,
}), {
    loadProcessesOwned,
})(MyOwnedProcesses);

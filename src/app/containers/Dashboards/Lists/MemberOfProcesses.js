/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadProcessesMemberOf } from 'store/actions/dashboard/dashboardActions';
import DashboardProcessList from './DashboardProcessList';

/**
 * View to display MemberOf task list
 */
class MemberOfProcesses extends PureComponent<Object, Object> {

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
        loadProcessesMemberOf: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    };

    loadData = (options: Object) => {
        const { user, loadProcessesMemberOf } = this.props;
        return loadProcessesMemberOf(user, options);
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex } = this.props;
        return (
            <DashboardProcessList
                loadData={this.loadData}
                title="Member Of Processes"
                {...{ records, isLoading, totalRecords, startIndex }}
            />
        );
    }
}

export default connect(state => ({
    isLoading: state.dashboard.processesMemberOf.isLoading,
    records: state.dashboard.processesMemberOf.records,
    startIndex: state.dashboard.processesMemberOf.startIndex,
    totalRecords: state.dashboard.processesMemberOf.count,
    user: state.user.profile,
}), {
    loadProcessesMemberOf,
})(MemberOfProcesses);

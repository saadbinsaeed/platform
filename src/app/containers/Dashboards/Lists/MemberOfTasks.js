/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTasksMemberOf } from 'store/actions/dashboard/dashboardActions';
import DashboardTaskList from './DashboardTaskList';

/**
 * View to display assigned task list
 */
class MemberOfTasks extends PureComponent<Object, Object> {

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
        loadTasksMemberOf: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    };

    loadData = (options: Object) => {
        const { user, loadTasksMemberOf } = this.props;
        return loadTasksMemberOf(user, options);
    }

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex } = this.props;
        return (
            <DashboardTaskList
                loadData={this.loadData}
                title="Member Of Tasks"
                {...{ records, isLoading, totalRecords, startIndex }}
            />
        );
    }
}

export default connect(state => ({
    isLoading: state.dashboard.tasksMemberOf.isLoading,
    records: state.dashboard.tasksMemberOf.records,
    startIndex: state.dashboard.tasksMemberOf.startIndex,
    totalRecords: state.dashboard.tasksMemberOf.count,
    user: state.user.profile,
}), {
    loadTasksMemberOf,
})(MemberOfTasks);

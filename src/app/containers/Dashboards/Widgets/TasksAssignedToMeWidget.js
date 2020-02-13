/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTasksAssigned } from 'store/actions/dashboard/dashboardActions';

import Widget from 'app/components/atoms/Widget/Widget';
import LinkList from './LinkList';

/**
 * Widget for displaying tasks assigned to the active user
 */
class TasksAssignedToMeWidget extends PureComponent<Object, Object> {
    static propTypes = {
        loadTasksAssigned: PropTypes.func,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        user: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        props.loadTasksAssigned(props.user, { linkOnly: true });
    }

    render() {
        const { isLoading, records } = this.props;
        return (
            <Widget
                title="Tasks"
                subTitle="Assigned to me"
                content={<LinkList list={records} type="task" />}
                url={`/dashboards/tasks/assigned`}
                loading={isLoading}
            />
        );
    }
}

const mapStateToProps: Function = ( state ) => {
    return {
        user: state.user.profile,
        isLoading: state.dashboard.tasksAssigned.isLoading,
        records: state.dashboard.tasksAssigned.records,
    };
};

export default connect(mapStateToProps, { loadTasksAssigned })(TasksAssignedToMeWidget);

/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTasksOwned } from 'store/actions/dashboard/dashboardActions';

import Widget from 'app/components/atoms/Widget/Widget';
import LinkList from './LinkList';

/**
 * Widget for displaying tasks assigned to the active user
 */
class TasksOwnedByMeWidget extends PureComponent<Object, Object> {
    static propTypes = {
        loadTasksOwned: PropTypes.func,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        user: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        props.loadTasksOwned(props.user, { linkOnly: true });
    }

    render() {
        const { isLoading, records } = this.props;
        return (
            <Widget
                title="Tasks"
                subTitle="Owned by me"
                content={<LinkList list={records} type="task" />}
                url={`/dashboards/tasks/owned`}
                loading={isLoading}
            />
        );
    }
}

const mapStateToProps: Function = ( state ) => {
    return {
        user: state.user.profile,
        isLoading: state.dashboard.tasksOwned.isLoading,
        records: state.dashboard.tasksOwned.records,
    };
};

export default connect(mapStateToProps, { loadTasksOwned })(TasksOwnedByMeWidget);

/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTasksDone } from 'store/actions/dashboard/dashboardActions';

import Widget from 'app/components/atoms/Widget/Widget';
import LinkList from './LinkList';

/**
 * Widget for displaying tasks assigned to the active user
 */
class TasksDoneWidget extends PureComponent<Object, Object> {
    static propTypes = {
        loadTasksDone: PropTypes.func,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
    };

    constructor(props) {
        super(props);
        props.loadTasksDone({ linkOnly: true });
    }

    render() {
        const { isLoading, records } = this.props;
        return (
            <Widget
                title="Tasks"
                subTitle="Done"
                content={<LinkList list={records} type="task" />}
                url={`/dashboards/tasks/done`}
                loading={isLoading}
            />
        );
    }
}

const mapStateToProps: Function = ( state ) => {
    return {
        isLoading: state.dashboard.tasksDone.isLoading,
        records: state.dashboard.tasksDone.records,
    };
};

export default connect(mapStateToProps, { loadTasksDone })(TasksDoneWidget);

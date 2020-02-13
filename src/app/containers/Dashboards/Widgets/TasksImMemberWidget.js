/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTasksMemberOf } from 'store/actions/dashboard/dashboardActions';

import Widget from 'app/components/atoms/Widget/Widget';
import LinkList from './LinkList';


/**
 * Widget for displaying tasks assigned to the active user
 */
class TasksImMemberWidget extends PureComponent<Object, Object> {
    static propTypes = {
        loadTasksMemberOf: PropTypes.func,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        user: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        props.loadTasksMemberOf(props.user, { linkOnly: true });
    }

    render() {
        const { isLoading, records } = this.props;
        return (
            <Widget
                title="Tasks"
                subTitle="Member of"
                content={<LinkList list={records} type="task" />}
                url={`/dashboards/tasks/member`}
                loading={isLoading}
            />
        );
    }
}

const mapStateToProps: Function = ( state ) => {
    return {
        user: state.user.profile,
        isLoading: state.dashboard.tasksMemberOf.isLoading,
        records: state.dashboard.tasksMemberOf.records,
    };
};

export default connect(mapStateToProps, { loadTasksMemberOf })(TasksImMemberWidget);

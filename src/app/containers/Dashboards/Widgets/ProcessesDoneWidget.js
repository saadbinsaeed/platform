/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadProcessesDone } from 'store/actions/dashboard/dashboardActions';

import Widget from 'app/components/atoms/Widget/Widget';
import LinkList from './LinkList';

/**
 * Widget for displaying tasks assigned to the active user
 */
class ProcessesDoneWidget extends PureComponent<Object, Object> {
    static propTypes = {
        loadProcessesDone: PropTypes.func,
        isLoading: PropTypes.bool,
        records: PropTypes.array
    };

    constructor(props) {
        super(props);
        props.loadProcessesDone(props.userId, { linkOnly: true });
    }

    render() {
        const { isLoading, records } = this.props;
        return (
            <Widget
                title="Processes"
                subTitle="Done"
                content={<LinkList list={records} type="process" />}
                url={'/dashboards/processes/done'}
                loading={isLoading} />
        );
    }
}

const mapStateToProps: Function = ( state ) => {
    return {
        userId: state.user.profile.id,
        isLoading: state.dashboard.processesDone.isLoading,
        records: state.dashboard.processesDone.records,
    };
};

export default connect(mapStateToProps, { loadProcessesDone })(ProcessesDoneWidget);

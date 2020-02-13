/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadProcessesAssigned } from 'store/actions/dashboard/dashboardActions';
import Widget from 'app/components/atoms/Widget/Widget';
import LinkList from './LinkList';


/**
 * Widget for displaying tasks assigned to the active user
 */
class ProcessesAssignedToMeWidget extends PureComponent<Object, Object> {
    static propTypes = {
        loadProcessesAssigned: PropTypes.func,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        user: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        props.loadProcessesAssigned(props.user, { linkOnly: true });
    }

    render() {
        const { isLoading, records } = this.props;
        return (
            <Widget
                title="Processes"
                subTitle="Assigned to me"
                content={<LinkList list={records} type="process" />}
                url={'/dashboards/processes/assigned'}
                loading={isLoading} />
        );
    }
}

const mapStateToProps: Function = ( state ) => {
    return {
        user: state.user.profile,
        isLoading: state.dashboard.processesAssigned.isLoading,
        records: state.dashboard.processesAssigned.records,
    };
};

export default connect(mapStateToProps, { loadProcessesAssigned })(ProcessesAssignedToMeWidget);

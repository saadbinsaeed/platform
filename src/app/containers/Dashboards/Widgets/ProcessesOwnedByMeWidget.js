/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadProcessesOwned } from 'store/actions/dashboard/dashboardActions';

import Widget from 'app/components/atoms/Widget/Widget';
import LinkList from './LinkList';

/**
 * Widget for displaying tasks assigned to the active user
 */
class ProcessesOwnedByMeWidget extends PureComponent<Object, Object> {
    static propTypes = {
        loadProcessesOwned: PropTypes.func,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        user: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        props.loadProcessesOwned(props.user, { linkOnly: true });
    }

    render() {
        const { isLoading, records } = this.props;
        return (
            <Widget
                title="Processes"
                subTitle="Owned by me"
                content={<LinkList list={records} type="process" />}
                url={'/dashboards/processes/owned'}
                loading={isLoading} />
        );
    }
}

const mapStateToProps: Function = ( state ) => {
    return {
        user: state.user.profile,
        isLoading: state.dashboard.processesOwned.isLoading,
        records: state.dashboard.processesOwned.records,
    };
};

export default connect(mapStateToProps, { loadProcessesOwned })(ProcessesOwnedByMeWidget);

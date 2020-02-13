/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadProcessesMemberOf } from 'store/actions/dashboard/dashboardActions';

import Widget from 'app/components/atoms/Widget/Widget';
import LinkList from './LinkList';


/**
 * Widget for displaying tasks assigned to the active user
 */
class ProcessesMemberOfWidget extends PureComponent<Object, Object> {
    static propTypes = {
        loadProcessesMemberOf: PropTypes.func,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        user: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        props.loadProcessesMemberOf(props.user, { linkOnly: true });
    }

    render() {
        const { isLoading, records } = this.props;
        return (
            <Widget
                title="Processes"
                subTitle="Member of"
                content={<LinkList list={records} type="process" />}
                url={'/dashboards/processes/member'}
                loading={isLoading} />
        );
    }
}

const mapStateToProps: Function = ( state ) => {
    return {
        user: state.user.profile,
        isLoading: state.dashboard.processesMemberOf.isLoading,
        records: state.dashboard.processesMemberOf.records,
    };
};

export default connect(mapStateToProps, { loadProcessesMemberOf })(ProcessesMemberOfWidget);

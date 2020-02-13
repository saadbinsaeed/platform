// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PageTemplate from 'app/components/templates/PageTemplate';
import Loader from 'app/components/atoms/Loader/Loader';
import history from 'store/History';
import { get } from 'app/utils/lo/lo';
import { getStr } from 'app/utils/utils';
import { loadStartedProcessDetails } from 'store/actions/abox/processActions';

/**
 * Renders the view to display the classification.
 */
class ProcessStarted extends PureComponent<Object, Object> {

    static propTypes = {
        loadStartedProcessDetails: PropTypes.func,
        isLoadingProcess: PropTypes.bool,
    };
    processId: ?string;

    constructor(props) {
        super(props);
        this.processId = getStr(props, 'match.params.processId');
        if (this.processId) {
            this.props.loadStartedProcessDetails(this.processId);
        }
    }

    componentDidUpdate(prevProps: Object) {
        const { processTasks, userProfileId, match } = this.props;
        this.processId = getStr(match, 'params.processId');
        const prevProcessId = getStr(prevProps, 'match.params.processId');
        if (this.processId && this.processId !== prevProcessId) {
            this.props.loadStartedProcessDetails(this.processId);
        } else if (processTasks && processTasks !== prevProps.processTasks) {
            const processId = String(this.processId);
            if (processTasks.length === 0) {
                return history.push(`/abox/process/${processId}`);
            }
            const assignedTasks = processTasks.filter(task => get(task, 'assignee.id') === userProfileId);
            if (assignedTasks.length === 1) {
                return history.push(`/abox/task/${assignedTasks[0].id}`);
            }
            return history.push(`/abox/process/${processId}/tasks`);
        }
    }

    /**
     * @override
     */
    render() {
        const { isLoadingProcess } = this.props;
        return (
            <PageTemplate title={'Starting...'} subTitle={this.processId}>
                {isLoadingProcess && <Loader absolute />}
            </PageTemplate>
        );
    }
}

export default connect(
    state => ({
        isLoadingProcess: state.abox.process.started.isLoading,
        processTasks: state.abox.process.started.data,
        userProfileId: state.user.profile.id,
    }), { loadStartedProcessDetails }
)(ProcessStarted);

// @flow
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';

import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { loadMessenger } from 'store/actions/messenger/messengerActions';
import { loadSubtasks, addSubtask } from 'store/actions/abox/taskActions';
import AddSubtask from 'app/containers/Abox/TaskView/AddSubtask';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import Modal from 'app/components/molecules/Modal/Modal';
import TasksView from 'app/components/organisms/TasksView/TasksView';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import Layout from 'app/components/molecules/Layout/Layout';

/**
 * Renders the view to display the classification.
 */
class TaskSubTasksTab extends PureComponent<Object, Object> {

    static propTypes = {
        details: PropTypes.object,
        loadSubtasks: PropTypes.func,
        addSubtask: PropTypes.func,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        startIndex: PropTypes.number,
        totalRecords: PropTypes.number,
        onSubtaskAdded: PropTypes.func,
        loadMessenger: PropTypes.func,
    };

    state: Object = {
        isAddSubtaskOpen: false,
        taskViewKey: 1,
    }

    defaultOrder = [{ field: 'name', direction: 'desc' }];

    @bind
    loadData(options?: Object) {
        return this.props.loadSubtasks({
            ...options,
            id: this.props.details.id,
        });
    };

    @bind
    toggleAddSubtask() {
        this.setState({ isAddSubtaskOpen: !this.state.isAddSubtaskOpen });
    }

    @bind
    resetView() {
        this.setState(state => ({
            taskViewKey: state.taskViewKey + 1,
        }));
    }

    @bind
    @memoize()
    buildVirtualListProps(totalRecords, records, isLoading, startIndex) {
        return {
            itemCount: totalRecords || 0,
            list: records,
            isLoading,
            startIndex: startIndex || 0,
            title: `${totalRecords >= 1000 ? '999+' : totalRecords } Sub Tasks`
        };
    }

    @bind
    @memoize()
    buildFiltersProps(id) {
        return {
            id: `TaskSubTasksTab.${id}`,
            defaultOrder: this.defaultOrder,
            defaultFilters: {},
        };
    }

    /**
     * @override
     */
    render() {
        const { isLoading, records, details: { id, endDate }, totalRecords, startIndex, addSubtask } = this.props;
        const { isAddSubtaskOpen, taskViewKey } = this.state;
        return (
            <Fragment>
                <Layout noPadding>
                    <TasksView
                        key={taskViewKey}
                        loadData={this.loadData}
                        FiltersProps={this.buildFiltersProps(id)}
                        VirtualListProps={this.buildVirtualListProps(totalRecords, records, isLoading, startIndex)}
                    />
                </Layout>

                {
                    !endDate &&
                    <FooterBar>
                        <TextIcon icon="plus" label="Add Sub-Task" onClick={this.toggleAddSubtask} />
                        <Modal
                            title="Add Subtask"
                            open={isAddSubtaskOpen}
                            onToggle={this.toggleAddSubtask}
                        >
                            <AddSubtask
                                taskId={id}
                                addSubtask={addSubtask}
                                refreshList={this.resetView}
                                closeAddSubtask={this.toggleAddSubtask}
                                onSubtaskAdded={this.props.onSubtaskAdded}
                            />
                        </Modal>
                    </FooterBar>
                }
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        details: state.abox.task.details.data,
        records: state.abox.task.subtasks.records,
        isLoading: state.abox.task.subtasks.isLoading,
        totalRecords: state.abox.task.subtasks.count,
        startIndex: state.abox.task.subtasks.startIndex,
    }), {
        loadSubtasks,
        addSubtask,
        loadMessenger
    }
)(withRouter(TaskSubTasksTab));

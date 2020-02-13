/* @flow */

import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import memoize from 'memoize-one';
import styled, { withTheme } from 'styled-components';

import Loader from 'app/components/atoms/Loader/Loader';
import PageTemplate from 'app/components/templates/PageTemplate';
import TabRow from 'app/components/molecules/Tabs/TabRow';
import TabItem from 'app/components/molecules/Tabs/TabItem';
import Text from 'app/components/atoms/Text/Text';
import TaskFormTab from 'app/containers/Abox/TaskView/TaskFormTab';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import TaskAboutTab from 'app/containers/Abox/TaskView/TaskAboutTab';
import AboxAttachments from 'app/components/ABox/Attachments/AboxAttachments';
import AboxTeam from 'app/components/ABox/Team/AboxTeam';
import TaskSubTasksTab from 'app/containers/Abox/TaskView/TaskSubTasksTab';
import TaskProcessMapTab from 'app/containers/Abox/TaskView/TaskProcessMapTab';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import TaskTimelineTab from 'app/containers/Abox/TaskView/TaskTimelineTab';
import { getPriorityColor } from 'app/config/aboxConfig';
import { set } from 'app/utils/lo/lo';
import { setSeconds } from 'app/utils/date/date';
import { bmpnVariablesToObject } from 'app/utils/bpmn/bpmnEngineUtils';
import {
    loadTaskDetails,
    closeTask,
    updateTask,
    setTaskAssignee,
    setTaskOwner,
    setTaskPriority
} from 'store/actions/abox/taskActions';
import { loadMessenger } from 'store/actions/messenger/messengerActions';
import { reloadIframe } from 'store/actions/legacy/legacyActions';
import { formatDate } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { getStr, getDate, datefy } from 'app/utils/utils';
import RelationshipsTab from 'app/containers/Entities/Relationships/RelationshipsTab';
import AddRelationship from 'app/containers/Entities/Relationships/AddRelationship';
import { ABOX_TASKS_RELATIONSHIPS_DATA_TABLE } from 'app/config/dataTableIds';

const TaskStatus = styled(Text)`
font-weight: 400;
text-transform: capitalize;
`;

/**
 *
 */
class TaskRoute extends PureComponent<Object, Object> {

    static propTypes = {
        details: PropTypes.object,
        isLoading: PropTypes.bool,
        loadTaskDetails: PropTypes.func,
        updateTask: PropTypes.func,
        setTaskAssignee: PropTypes.func,
        setTaskOwner: PropTypes.func,
        setTaskPriority: PropTypes.func,
        reloadIframe: PropTypes.func,
    };

    id: string;

    /**
     *
     */
    constructor(props: Object) {
        super(props);
        this.id = getStr(props, 'match.params.id') || '';
        if (this.id) {
            this.props.loadTaskDetails(this.id);
        }
    }

    componentDidUpdate(prevProps: Object) {
        this.id = getStr(this.props, 'match.params.id') || '';
        if (!prevProps.outdated && this.props.outdated) {
            this.props.loadTaskDetails(this.id);
        }
    }

    buildInfo = memoize((details: Object) => {
        const ownerName = get(details, 'owner.name', '');
        const startDate = formatDate(get(details, 'startDate', ''));
        const status = get(details, 'variable.taskStatus.status', '');
        return [
            { key: 'Owner', value: ownerName, },
            { key: 'Created Date', value: startDate },
            { key: 'Status', value: <TaskStatus>{status}</TaskStatus> },
        ];
    });

    loadDetails = () => {
        return this.props.loadTaskDetails(this.id);
    }

    updateField = (event) => {
        const { name, value } = event.target || event;
        const { setTaskAssignee, setTaskOwner, setTaskPriority, reloadIframe } = this.props;
        const { loadDetails } = this;
        switch (name) {
            case 'assignee':
                setTaskAssignee(String(this.id), value && { id: value.id }).then(() => {
                    reloadIframe();
                    loadDetails();
                });
                break;
            case 'owner':
                setTaskOwner(String(this.id), value && { id: value.id }).then(loadDetails);
                break;
            case 'priority': value && setTaskPriority(this.id, value).then(loadDetails);
                break;
            case 'bpmnVariables.startDate': {
                const task: Object = { id: this.id, bpmnVariables: { startDate: value } };
                const start = setSeconds(datefy(value), 0, 0);
                const due = setSeconds(getDate(this.props.details, 'dueDate'), 0, 0);
                if (start && due && due <= start) {
                    task.dueDate = new Date(start.getTime() + 3600000);
                }
                this.props.updateTask(task).then(loadDetails);
                break;
            }
            case 'dueDate': {
                const task: Object = { id: this.id, dueDate: value };
                const bpmnVariables = bmpnVariablesToObject(this.props.details.bpmnVariables);
                const start = setSeconds(getDate(bpmnVariables, 'startDate'), 0, 0);
                let due = setSeconds(datefy(value), 0, 0);
                due = due && new Date(due);
                due && due.setSeconds(0, 0);
                if (start && due && start >= due) {
                    task.bpmnVariables = { startDate: new Date(due.getTime() - 3600000) };
                }
                this.props.updateTask(task).then(loadDetails);
                break;
            }
            default: {
                let task = { id: this.id };
                task = set(task, name, typeof value === 'string' ? value.trim() : value);
                this.props.updateTask(task).then(loadDetails);
            }
        }
    };

    handleCloseTask = () => this.props.closeTask(this.id).then((response) => {
        if (response instanceof Error) return;

        this.props.loadTaskDetails(this.id);
    });

    buildAboxAttachments = memoize(routeProps => <AboxAttachments {...routeProps} type="task" />);

    buildAboxTeam = memoize((details, reloadDetails) =>
        <AboxTeam reloadDetails={reloadDetails} details={details} type="task" />
    );

    buildTaskFormTab = memoize((details, updateField) => <TaskFormTab details={details} updateField={updateField} />);

    buildTaskAboutTab = memoize((details, updateField) => <TaskAboutTab details={details} updateField={updateField} />);

    buildMenuItems = memoize((hasActions, handleCloseTask) => hasActions && <MenuItem name="Close task" icon="check-circle" onClick={handleCloseTask}/>);

    getHeaderStyle = memoize(headerBackgroundColor => ({ background: headerBackgroundColor }));

    buildSubtaskTab = memoize(() => <TaskSubTasksTab onSubtaskAdded={this.loadDetails} />);
    /**
     * @override
     */
    render(): Object {
        const { details, isLoading, match, loadMessenger, theme, loadTaskDetails } = this.props;
        if (!isLoading && !details) {
            return <PageNotAllowed title={`Task. (ID:${this.id})`} />;
        }
        const areDetailsWrong = this.id !== getStr(details, 'id');
        const loading = (isLoading || areDetailsWrong);
        const { name, variable, endDate, priority, form } = details || {};
        const infoArray = this.buildInfo(details);
        const isClosed = !!endDate;
        const priorityColor = endDate ? 'disabled' : getPriorityColor(priority);
        const headerBackgroundColor = `linear-gradient(45deg, ${theme.priorityGradients[priorityColor][0]}, ${theme.priorityGradients[priorityColor][1]})`;
        const hasForm = form && form.id;
        const updateField = this.updateField;
        return (
            <Fragment>
                { loading && <Loader backdrop absolute /> }
                {
                    !areDetailsWrong && details &&
                    <PageTemplate
                        title={`${name || 'No Name'} ${isClosed ? '(closed)' : ''}`}
                        subTitle={`#${this.id}`}
                        pillText={`${(variable && Math.floor(Number(variable.completion))) || 0}%`}
                        info={infoArray}
                        actions={
                            <Fragment>
                                <ButtonIcon icon="messenger" type="af" title="Open messenger" onClick={() => loadMessenger(this.id, 'task')}/>
                            </Fragment>
                        }
                        menuItems={this.buildMenuItems(!hasForm && !isClosed, this.handleCloseTask)}
                        color={this.getHeaderStyle(headerBackgroundColor)}
                        overflowHidden={ true }
                    >
                        <TabRow color={headerBackgroundColor}>
                            {hasForm && <TabItem label="Form" to={`/abox/task/${this.id}/form`} />}
                            <TabItem label="About" to={`/abox/task/${this.id}/about`} />
                            <TabItem label="Sub-Tasks" to={`/abox/task/${this.id}/subtasks`} />
                            <TabItem label="Team" to={`/abox/task/${this.id}/team`} />
                            <TabItem label="Relationships" to={`/abox/task/${this.id}/relationships`} />
                            <TabItem label="Attachments" to={`/abox/task/${this.id}/attachments`} />
                            <TabItem label="Process Map" to={`/abox/task/${this.id}/process-map`} />
                            <TabItem label="History" to={`/abox/task/${this.id}/history`} />
                        </TabRow>
                        <Switch>
                            <Route path={`${match.url}/`} exact render={() => <Redirect to={`${match.url}/${hasForm ? 'form' : 'about'}`} />} />
                            <Route path={'/abox/task/:id/form'} render={() => hasForm ? this.buildTaskFormTab(details, updateField) : <Redirect to={`${match.url}/about`} />} />
                            <Route path={'/abox/task/:id/about'} render={() => this.buildTaskAboutTab(details, updateField)} />
                            <Route path={'/abox/task/:id/subtasks'} render={() => this.buildSubtaskTab()} />
                            <Route path={'/abox/task/:id/team'} render={() => this.buildAboxTeam(details, loadTaskDetails)} />
                            <Route path={'/abox/task/:id/attachments'} render={props => this.buildAboxAttachments(props)} />
                            <Route
                                path={`/abox/task/:entityId/relationships/:type2/add`}
                                exact
                                render={({ match: { params }, location }) => (<AddRelationship
                                    {...params}
                                    location={location}
                                    type1={'task'}
                                />)}
                            />
                            <Route
                                path={'/abox/task/:id/relationships'}
                                exact
                                component={() => <Redirect to={`/abox/task/${this.id}/relationships/thing`}/>}
                            />
                            <Route
                                path={'/abox/task/:entityId/relationships/:type2'}
                                render={({ match: { params } }) => (<RelationshipsTab
                                    {...params}
                                    dataTableId={ABOX_TASKS_RELATIONSHIPS_DATA_TABLE}
                                    baseUri={`/abox/task/${this.id}/relationships`}
                                    type1={'task'}
                                />)}
                            />
                            <Route path={'/abox/task/:id/process-map'} component={TaskProcessMapTab} />
                            <Route path={'/abox/task/:id/history'} render={() => <TaskTimelineTab id={this.id} />} />
                        </Switch>
                    </PageTemplate>
                }
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.abox.task.details.isLoading,
        details: state.abox.task.details.data,
        outdated: state.abox.task.detailsOutdated,
        message: state.chat.messages,
    }),
    {
        loadTaskDetails,
        closeTask,
        updateTask,
        setTaskAssignee,
        setTaskOwner,
        setTaskPriority,
        loadMessenger,
        reloadIframe,
    }
)(withTheme(TaskRoute));

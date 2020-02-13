/* @flow */

import React, { PureComponent, Fragment } from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { bind } from 'app/utils/decorators/decoratorUtils';
import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';
import { involvementConditions } from 'app/utils/static/filter-conditions';

import { loadTimelineTasks, updateTask, setTaskAssignee } from 'store/actions/abox/taskActions';
import { setTimelineRange } from 'store/actions/abox/aboxActions';
import { setHeader, showToastr } from 'store/actions/app/appActions';

import Loader from 'app/components/atoms/Loader/Loader';
import TimelineToolbar from 'app/components/ABox/Timeline/TimelineToolbar';
import PageTemplate from 'app/components/templates/PageTemplate';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { FiltersTimeline } from 'app/components/ABox/Timeline/style';
import TimelineTaskModal from './TimelineTaskModal';
import ReloadCountdown from 'app/components/molecules/ReloadCountdown/ReloadCountdown';
import Gantt from 'app/components/organisms/Gantt/Gantt';

class Timeline extends PureComponent<Object, Object> {
    
    static propTypes = {
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        totalRecords: PropTypes.number,
        userProfile: PropTypes.object,
        loadTimelineTasks: PropTypes.func.isRequired,
        updateTask: PropTypes.func.isRequired,
        setHeader: PropTypes.func,
    };

    static defaultProps = {
        isLoading: false,
        records: [],
        totalRecords: 0
    };

    state = {
        isModalOpen: false,
        isLoadingUpdateTask: false,
        selectedTask: null,
        disableCountdown: false,
        countdownSeconds: 180
    };

    searchBar = ['name', 'id'];
    defaultFilters = { status: 'is null', involvement: 'assignee'};
    defaultOrder = [{ field: 'taskStatus.lastUpdate', direction: 'desc' }];

    filterDefinitions: Array<Object> = [
        {
            field: 'assignee.id',
            type: 'userTypeahead',
            properties: {
                label: 'Assignee',
                name: 'assigneeId',
            },
            condition: '=',
        },
        {
            field: 'involvement',
            type: 'typeahead',
            properties: {
                label: 'My involvement',
                name: 'involvement',
                options: involvementConditions,
            },
            sort: false,
        },
        {
            field: 'name',
            type: 'text',
            properties: {
                label: 'Name',
                name: 'name'
            },
        },
        {
            field: 'id',
            type: 'text',
            properties: {
                label: 'ID',
                name: 'id'
            },
            condition: '=',
        },
        {
            field: 'endDate',
            type: 'typeahead',
            properties: {
                label: 'Status',
                name: 'status',
                options: [
                    { value: 'is null', label: 'Open' },
                    { value: 'is not null', label: 'Closed' },
                ],
            },
            sort: false
        },
        {
            field: 'priority',
            type: 'typeahead',
            properties: {
                label: 'Priority',
                name: 'priority',
                options: PRIORITY_OPTIONS,
            },
            condition: '='
        },
        {
            field: 'process.processDefinition.name',
            type: 'processTypeTypeahead',
            properties: {
                label: 'Process Type',
                name: 'processDefinitionName',
            },
            condition: '='
        },
        {
            field: 'startDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Created date',
                name: 'startDate',
            },
        },
        {
            field: 'bpmnVariables.startDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Start date',
                name: 'bpmnVariablesStartDate',
            },
        },
        {
            field: 'dueDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Due date',
                name: 'dueDate',
            },
        },
        {
            field: 'endDate',
            type: 'dateTimeRange',
            properties: {
                label: 'End date',
                name: 'endDate',
            },
        },
        {
            field: 'taskStatus.lastUpdate',
            type: 'dateTimeRange',
            properties: {
                label: 'Last updated date',
                name: 'taskStatusLastUpdate',
            },
        },
    ];

    ganttRef: Object;

    constructor(props){ 
        super(props);
        this.ganttRef = React.createRef();
    }

    @bind
    onChangeRange(e) {
        this.props.setTimelineRange(e.target.value);
    }

    @bind
    onPrevious() {
        this.ganttRef.current.viewPreviousDates();
    }

    @bind
    onNext() {
        this.ganttRef.current.viewNextDates();
    }

    @bind
    onToday() {
        if (this.props.range === 'days') {
            this.ganttRef.current.viewToday();
        } else {
            this.props.setTimelineRange('days');
        }
    }

    @bind
    updateTaskDate(id: string, mode: 'resize' | 'move' | 'progress', task: Object) {
        let taskData: Object = { id: id };

        switch (mode) {
            case 'move':
            case 'resize':
                taskData = {
                    ...taskData,
                    bpmnVariables: { startDate: new Date(task.start_date) },
                    dueDate: new Date(task.end_date),
                };
                break;
            default:
                break;
        }

        this.props.updateTask(taskData)
            .then((response) => {
                if (response instanceof Error) return;
                this.ganttRef.current.updateTask(task);
            });
    }

    @bind
    openTaskModal(id: string, task: Object) {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            selectedTask: task
        });
    }

    @bind
    closeTaskModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            selectedTask: null
        });
    }

    @bind
    updateTimelineTask(task: Object) {
        this.ganttRef.current.updateTask(task);
        this.closeTaskModal();
    }

    @bind
    refreshAction() {
        this.ganttRef.current.refreshData();
    }

    loadTasks = memoize((options, start: Date, end: Date) => {
        const filterBy = [];
        const { activitiId, groups } = this.props.userProfile;
        let useFilterOverRange = false;

        (options.filterBy || []).forEach((filter) => {
            const { or, field, op, value } = filter;
            
            if (or) {
                filterBy.push(filter);
            } else if (field === 'involvement') {
                switch (value) {
                    case 'assignee':
                        filterBy.push({ field: 'assignee.activitiId', op: '=', value: activitiId });
                        break;
                    case 'owner':
                        filterBy.push({ field: 'owner.activitiId', op: '=', value: activitiId });
                        break;
                    case 'teamMember':
                        filterBy.push({ or: [
                            { field: 'teamMembers.user.activitiId', op: '=', value: activitiId },
                            { field: 'teamMembers.group.id', op: 'in', value: groups }
                        ]});
                        break;
                    default:
                }
            } else if (field.startsWith('bpmnVariables')) {
                const name = field.split('.')[1];
                filterBy.push(
                    { field: 'bpmnVariables.name', op: '=', value: name },
                    { field: 'bpmnVariables.text', op, value }
                );

                // if start date is filtered prioritize this filter over range
                if (name === 'startDate') {
                    useFilterOverRange = true;
                }
            } else {
                // if due date is filtered prioritize this filter over range
                if (field === 'dueDate') {
                    useFilterOverRange = true;
                }

                filterBy.push(filter);
            }
        });
        
        // set default range filter to null and use date filters instead
        if (useFilterOverRange) {
            return this.props.loadTimelineTasks({ ...options, filterBy });
        } else {
            return this.props.loadTimelineTasks({ ...options, filterBy }, start, end);
        }

    })

    componentDidMount() {
        this.props.setHeader({ title: 'Timeline (Beta)'});
    }

    render() {
        const { records, isLoading, totalRecords, updateTask, setTaskAssignee, showToastr, range } = this.props;
        const { isLoadingUpdateTask, disableCountdown, countdownSeconds, } = this.state;

        return (
            <Fragment>
                <FiltersTimeline
                    id="TimeLineFilters"
                    filterDefinitions={this.filterDefinitions}
                    searchBar={this.searchBar}
                    defaultFilters={this.defaultFilters}
                    defaultOrder={this.defaultOrder}
                    leftToolbar={
                        <TimelineToolbar 
                            ganttRef={this.ganttRef} 
                            onChangeRange={this.onChangeRange} 
                            onPrevious={this.onPrevious} 
                            onNext={this.onNext} 
                            onToday={this.onToday} 
                            range={range}
                            totalRecords={totalRecords}
                        />
                    }
                    rightToolbar={
                        <ReloadCountdown disableCountdown={disableCountdown || isLoading} seconds={countdownSeconds} format="minutes" action={this.refreshAction} />
                    }
                >
                    {(filterBy, orderBy) => {
                        return (
                            <PageTemplate title="Dashboard">
                                <ContentArea>
                                    {(isLoading || isLoadingUpdateTask) && <Loader absolute />}
                                    <Gantt
                                        ref={this.ganttRef}
                                        zoom={range} 
                                        resize={this.props.isNavOpen} 
                                        loadData={this.loadTasks}
                                        filterBy={filterBy}
                                        orderBy={orderBy}
                                        records={records}
                                        onAfterTaskDrag={this.updateTaskDate}
                                        onTaskClick={this.openTaskModal}
                                        showToastr={showToastr}
                                    />
                                </ContentArea>
                            </PageTemplate>
                        );
                    }}
                </FiltersTimeline>

                <TimelineTaskModal
                    task={this.state.selectedTask}
                    isOpen={this.state.isModalOpen}
                    closeModal={this.closeTaskModal}
                    updateTask={updateTask}
                    setTaskAssignee={setTaskAssignee}
                    updateTimelineTask={this.updateTimelineTask}
                />
            </Fragment>
        );
    }
}

export default connect(state => ({
    isLoading: state.abox.task.timeline.isLoading,
    records: state.abox.task.timeline.records,
    totalRecords: state.abox.task.timeline.count,
    userProfile: state.user.profile,
    isNavOpen: state.app.isNavOpen,
    range: state.abox.timeline.range
}), {
    loadTimelineTasks,
    updateTask,
    setTaskAssignee,
    setHeader,
    showToastr,
    setTimelineRange
})(Timeline);


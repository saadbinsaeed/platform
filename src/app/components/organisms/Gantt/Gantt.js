/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debouncePromise from 'debounce-promise';
import moment from 'moment';

import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_smart_rendering';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip';

import { isMobile } from 'react-device-detect';
import { tasksFormatter, linesFormatter } from 'app/utils/gantt/formatter';
import { validateTaskStartDate, getLatestPredecessor } from 'app/utils/gantt/utils';
import { 
    tooltipTemplate, 
    hourScaleTemplate, 
    dayScaleTemplate, 
    weekScaleTemplate, 
    monthScaleTemplate, 
    gridTaskTemplate, 
    taskTemplate,
    gridTaskStartDateTemplate,
    gridTaskEndDateTemplate
} from 'app/utils/gantt/templates';

import './Gantt.scss';

const ganttHeight = isMobile ? `calc(${window.innerHeight}px - 170px)` : '100%';

export default class Gantt extends PureComponent<Object, Object> {
    static propTypes = {
        zoom: PropTypes.string,
        resize: PropTypes.bool,
        loadData: PropTypes.func.isRequired,
        onAfterTaskDrag: PropTypes.func.isRequired,
        onTaskClick: PropTypes.func.isRequired,
        showToastr: PropTypes.func.isRequired,
        filterBy: PropTypes.array,
        orderBy: PropTypes.array,
        records: PropTypes.array
    }

    static defaultProps = {
        zoom: 'weeks',
        resize: false,
    }

    state = { 
        tasks: {
            data: [],
            links: []
        }
    }

    ganttContainer: any
    ganttEvents: any[]

    // get all task with predecessor to allow disable date changes
    taskWithPredecessor: Object[] = []

    // the current dragged task
    currentTask: Object

    setGanttRange(start: any, end: any) {
        gantt.config.start_date = new Date(start);
        gantt.config.end_date = new Date(end);
    }

    setGanttRangeOnZoom(range: string) {
        const today = moment();
        let startDate, endDate;

        switch (range){
            case 'days':
                startDate = today.clone().startOf('date');
                endDate = startDate.clone().add(1, 'd').subtract(1, 's');
                break;
            case 'weeks':
                startDate = today.clone().startOf('isoWeek');
                endDate = today.clone().endOf('isoWeek');
                break;
            case 'months':
                startDate = today.clone().startOf('month');
                endDate = today.clone().endOf('month');
                break;
            case 'years':
                startDate = today.clone().startOf('year');
                endDate = today.clone().endOf('year');
                break;
            default:
                break;
        }

        // set start end date of gantt chart
        this.setGanttRange(startDate, endDate);
    }

    setNewGanttRange(op: string, units: string, key: string) {
        // convert m = minutes to M for months
        const newKey = key === 'm' ? key.toUpperCase() : key;

        const startDate = moment(gantt.config.start_date);
        const endDate = moment(gantt.config.end_date);

        // add and subract dates based on moment.add().subtract()

        // $FlowFixMe
        startDate[op](units, newKey);

        // $FlowFixMe
        endDate[op](units, newKey);

        // set start end date of gantt chart
        this.setGanttRange(startDate, endDate);
        gantt.render();
    }

    viewNextDates() {
        const key = this.props.zoom.charAt(0);
        this.setNewGanttRange('add', '1', key);
        this.refreshData();
    }

    viewPreviousDates() {
        const key = this.props.zoom.charAt(0);
        this.setNewGanttRange('subtract', '1', key);
        this.refreshData();
    }

    viewToday() {
        const zoom = 'days';
        this.setGanttZoom(zoom);
        this.setGanttRangeOnZoom(zoom);
        this.refreshData();
        gantt.render();
    }

    setGanttZoom(range: string) {
        switch (range){
            case 'days':
                gantt.config.scale_height = 90;
                gantt.config.scale_unit = 'day';
                gantt.config.date_scale = '%j %F %Y, %l';
                gantt.config.subscales = [
                    { unit: 'hour', step: 1, date: '%g %a', template: hourScaleTemplate },
                ];
                break;
            case 'weeks':
                gantt.config.scale_height = 90;
                gantt.config.scale_unit = 'day';
                gantt.config.date_scale = '%j %F %Y, %l';
                gantt.config.subscales = [
                    { unit: 'hour', step: 3, date: '%g %a', template: hourScaleTemplate },
                ];
                break;
            case 'months':
                gantt.config.scale_height = 90;
                gantt.config.scale_unit = 'month';
                gantt.config.date_scale = '%F %Y';
                gantt.config.subscales = [
                    { unit: 'day', step: 1, template: dayScaleTemplate }
                ];
                break;
            case 'years':
                gantt.config.scale_height = 130;
                gantt.config.scale_unit = 'year';
                gantt.config.date_scale = '%Y';
                gantt.config.subscales = [
                    { unit: 'month', step: 1, template: monthScaleTemplate },
                    { unit: 'week', step: 1, template: weekScaleTemplate }
                ];
                break;
            default:
                break;
        }
    }

    updateTask(task: Object) {
        if (!task) return;
        this.refreshData();
    }

    refreshData() {
        this.loadData(new Date(gantt.config.start_date), new Date(gantt.config.end_date));
    }

    initGanttConfig() {
        gantt.config.drag_resize = true;
        gantt.config.drag_progress = false;
        gantt.config.drag_links = false;
        gantt.config.drag_move = true;
        gantt.config.row_height = 60;
        gantt.config.task_height = 44;
        gantt.config.link_line_width = 1;
        gantt.config.details_on_dblclick = false;
        gantt.config.fit_tasks = true;
        gantt.config.smart_rendering = true;
        gantt.config.min_column_width = 70;
        gantt.config.scale_height = 90;
        gantt.config.show_progress = true;

        // if mobile hide grid
        if (isMobile) gantt.config.show_grid = false;

        gantt.config.columns =  [
            { name:'text', label:'Task Name', 'width': '*', tree: true, template: gridTaskTemplate, min_width: 170, resize: true },
            { name:'start_date', label:'Start Date', 'width': 100, align: 'center', template: gridTaskStartDateTemplate },
            { name:'end_date', label:'Due Date', 'width': 100, align: 'center', template: gridTaskEndDateTemplate }
        ];
    }

    initTemplateConfig() {
        // set task content
        gantt.templates.task_text = (start, end, task) => {
            return taskTemplate(task);
        };
        
        // set tooltip content
        gantt.templates.tooltip_text = (start, end, task) => {
            return tooltipTemplate(task);
        };

        // set task class based on priority
        gantt.templates.task_class = (start, end, task) => {
            const isClosed = task.endDate ? true : false;
            if (isClosed) return 'closed';
            
            switch (task.priority) {
                case 5:
                    return 'info';
                case 4:
                    return 'success';
                case 3:
                    return 'alert';
                case 2:
                    return 'warning';
                case 1:
                    return 'danger';
                default:
                    break;
            }
        };
    }

    initGanttEvents() {
        const { onAfterTaskDrag, onTaskClick } = this.props;
        let clickTimeout = null;
        this.ganttEvents = [];

        this.ganttEvents.push(gantt.attachEvent('onGanttReady', () => {
            const tooltips = gantt.ext.tooltips;
            tooltips.tooltip.setViewport(gantt.$task_data);
        }));

        this.ganttEvents.push(gantt.attachEvent('onTaskClick', (id, e) => {
            // handle if single or double click (cannot run onTaskClick and onTaskDblClick at the same time)
            if (clickTimeout !== null) {
                window.open(`/#/abox/task/${id}`, '_blank');
                clearTimeout(clickTimeout);
                clickTimeout = null;
            } else {
                clickTimeout = setTimeout(()=>{
                    const task = gantt.getTask(id);
                    onTaskClick(id, task);
                    if (clickTimeout) {
                        clearTimeout(clickTimeout);
                    }
                    clickTimeout = null;
                }, 300);
            }
        }));

        this.ganttEvents.push(gantt.attachEvent('onBeforeTaskDrag', (id, mode, e) => {
            const modes = gantt.config.drag_mode;

            if (!(mode === modes.move || mode === modes.resize)) return true;

            this.currentTask = { ...gantt.getTask(id) };
            
            // if task is closed disable drag
            if (this.currentTask.endDate) return false;
            
            return true;
        }));

        this.ganttEvents.push(gantt.attachEvent('onAfterTaskDrag', (id, mode, e) => {
            const task = gantt.getTask(id);

            if (validateTaskStartDate(task, this.taskWithPredecessor)) {
                onAfterTaskDrag(id, mode ,task);
            } else {
                task.start_date = new Date(this.currentTask.start_date);
                task.end_date =  new Date(this.currentTask.end_date);
                gantt.updateTask(id);

                const predecessorTask = getLatestPredecessor(task, this.taskWithPredecessor);

                if (predecessorTask) {
                    const { name, dueDate } = predecessorTask.predecessor;
                    const formattedDueDate = moment(dueDate).format('DD-MM-YYYY HH:mm');
                    
                    this.props.showToastr({ 
                        severity: 'warn', 
                        detail: `Update not possible due to conflicting due date for a preceeding task (${name}, ${formattedDueDate}). Kindly check your task relationship` 
                    });
                }
            }
        }));
    }

    loadData = debouncePromise((start: Date, end: Date) => {
        const { filterBy, orderBy, loadData } = this.props;

        const promise = loadData({ filterBy, orderBy }, start, end);
        const isPromise = promise instanceof Promise;

        if (!isPromise) {
            throw new Error('The loadData function MUST return a Promise.');
        }

        return promise;
    }, 400)

    componentDidUpdate(prevProps: Object) {
        const { orderBy, filterBy, records, zoom } = this.props;

        // rerender gantt
        gantt.render();

        // reset size of gantt chart
        setTimeout(() => {
            gantt.setSizes();
        }, 1000);

        if (orderBy !== prevProps.orderBy || filterBy !== prevProps.filterBy) {
            this.refreshData();
        }

        if (records !== prevProps.records) {
            // format the tasks and lines for the gantt chart
            const formattedTasks = tasksFormatter(records);
            const { lines, tasksWithPredecessor } = linesFormatter(records);
            const formattedLinks = lines;
            this.taskWithPredecessor = tasksWithPredecessor;
            
            this.setState({
                tasks: {
                    data:  formattedTasks,
                    links: formattedLinks
                }
            }, () => {
                gantt.clearAll();
                gantt.parse(this.state.tasks);
            });
        }

        if (zoom !== prevProps.zoom) {
            this.setGanttZoom(zoom);
            this.setGanttRangeOnZoom(zoom);
            this.refreshData();
        }
    }

    componentDidMount() {
        this.initGanttConfig();
        this.initTemplateConfig();
        this.initGanttEvents();

        const { zoom } = this.props;
        this.setGanttZoom(zoom);
        this.setGanttRangeOnZoom(zoom);

        gantt.init(this.ganttContainer);
        gantt.parse(this.state.tasks);

        this.refreshData();
    }
    
    componentWillUnmount() {
        while (this.ganttEvents.length)
            gantt.detachEvent(this.ganttEvents.pop());
    }

    render() {
        return (
            <div className={'dark'}
                ref={(input) => { this.ganttContainer = input; }}
                style={{ width: '100%', height: ganttHeight }}
            />
        );
    }
}

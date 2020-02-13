/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import moment from 'moment';
import styled from 'styled-components';

import Filters from 'app/components/organisms/Filters/Filters';
import Calendar from 'app/components/molecules/Calendar/Calendar';
import { loadCalendarTasks } from 'store/actions/abox/taskActions';
import { datefy, getDate } from 'app/utils/utils';
import { bmpnVariablesToObject } from 'app/utils/bpmn/bpmnEngineUtils';
import { getPriorityColor } from 'app/config/aboxConfig';
import { get } from 'app/utils/lo/lo';
import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';
import { involvementConditions } from 'app/utils/static/filter-conditions';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { setHeader } from 'store/actions/app/appActions';
import { shallowEquals } from 'app/utils/utils';

const CalendarWrapper = styled.div`
overflow: auto;
height: 100%;
max-height: calc(100vh - 147px);
@media (max-width: ${( { theme } ) => theme.media.sm} ) {
    max-height: calc(100vh - 200px);
}
`;

/**
 * Renders the view to display the task calendar.
 */
class AboxCalendar extends PureComponent<Object, Object> {

    state = { start: null, end: null }

    componentDidMount() {
        this.props.setHeader({ title: 'A-Box Calendar '});
    }

    filterDefinitions: Array<Object> = [
        {
            field: 'assignee.id',
            type: 'userTypeahead',
            properties: {
                label: 'Assignee',
                name: 'assigneeId',
            },
            condition: '=',
            sort: false,
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
            sort: false,
        },
        {
            field: 'id',
            type: 'text',
            properties: {
                label: 'ID',
                name: 'id'
            },
            condition: '=',
            sort: false,
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
            condition: '=',
            sort: false,
        },
        {
            field: 'startDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Created date',
                name: 'startDate',
            },
            sort: false,
        },
        {
            field: 'endDate',
            type: 'dateTimeRange',
            properties: {
                label: 'End date',
                name: 'endDate',
            },
            sort: false,
        },
        {
            field: 'taskStatus.lastUpdate',
            type: 'dateTimeRange',
            properties: {
                label: 'Last updated date',
                name: 'taskStatusLastUpdate',
            },
            sort: false,
        },
    ];
    searchBar = ['name', 'id'];
    defaultFilters = { involvement: 'assignee' };

    @bind
    @memoize(shallowEquals)
    buildEvents(tasks) {
        return tasks.filter(task => task)
            .map((task) => {
                const { dueDate, bpmnVariables, name, ...event } = task;
                let end = datefy(dueDate);
                const variables = bmpnVariablesToObject(bpmnVariables);
                let start = getDate(variables, 'startDate');
                if (!start && end) {
                    start = moment(end).startOf('day').toDate();
                    end = moment(end).endOf('day').toDate();
                }
                if (start && !end) {
                    start = moment(start).startOf('day').toDate();
                    end = moment(start).endOf('day').toDate();
                }

                return { ...event, title: name || 'No Name', start, end };
            }).filter(({ start, end }) => start && end);
    };

    @bind
    goToTask({ id }) {
        this.props.history.push(`/abox/task/${id}`);
    };

    @bind
    buildEventProp({ endDate, priority }, start, end, isSelected) {
        const { theme } = this.props;
        const style = {};
        const priorityColor = endDate ? 'disabled' : getPriorityColor(priority);
        const backgroundColor = String(get(theme, `priorityColors.${priorityColor}`));
        if (backgroundColor) {
            style.backgroundColor = `${backgroundColor}90`;
        }
        return { style };
    }

    @bind
    @memoize()
    resetView(start, end, filters) {
        const { activitiId, groups } = this.props.userProfile;
        const filterBy = [];
        (filters || []).forEach((filter) => {
            const { or, field, value } = filter;
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
            } else {
                filterBy.push(filter);
            }
        });
        const { userProfile: { id } } = this.props;
        if(start && end) {
            this.props.loadCalendarTasks(id, start, end, { filterBy });
        }
    }

    @bind
    onDateRangeChange(filterBy) {
        return ({ start, end }) => {
            this.setState({ start, end }, () => this.resetView(start, end, filterBy));
        };
    };

    @bind
    @memoize()
    buildCalendar(events) { return (filterBy) => {
        const { start, end } = this.state;
        this.resetView(start, end, filterBy);
        return (
            <CalendarWrapper>
                <Calendar
                    calendarId={'abox'}
                    isLoading={this.props.isLoading}
                    events={events}
                    eventPropGetter={this.buildEventProp}
                    onSelectEvent={this.goToTask}
                    onDateRangeChange={this.onDateRangeChange(filterBy)}
                />
            </CalendarWrapper>
        );
    };}

    /**
     * @override
     */
    render(): Object {
        const { tasks } = this.props;
        const events = this.buildEvents(tasks);
        return (
            <Filters
                id="AboxCalendarFilters"
                filterDefinitions={this.filterDefinitions}
                searchBar={this.searchBar}
                defaultFilters={this.defaultFilters}
            >
                {this.buildCalendar(events)}
            </Filters>
        );
    }
}

export default withTheme(connect(state => ({
    userProfile: state.user.profile,
    tasks: state.abox.task.calendar.records,
    isLoading: state.abox.task.calendar.isLoading,
}), { loadCalendarTasks, setHeader })(AboxCalendar));

/* @flow */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { darken, lighten } from 'polished';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import Loader from 'app/components/atoms/Loader/Loader';
import { equals as dateEquals, setHours } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { saveCalendarState } from 'store/actions/common/calendarActions';

import './Calendar.css';

const StyledBigCalendar = styled(BigCalendar)`

max-width: 100vw;

.rbc-row-segment {
    padding: 1px;
}

.rbc-month-view {
    min-height: 532px;
    overflow: auto;
}

.rbc-overlay {
    background:  ${({ theme }) => theme.widget.background};
}

.rbc-toolbar {
    overflow-y: hidden;
    overflow-x: auto;
    min-height: 70px;
    button {
        border-color: ${({ theme }) => theme.base.borderColor};
        color: ${({ theme }) => theme.base.textColor};
        &:hover {
            color: ${({ theme }) => theme.base.active.textColor};
            border-color: ${({ theme }) => theme.base.borderColor};
            background: ${({ theme }) => theme.base.active.background};
        }
        &:focus {
            color: ${({ theme }) => theme.base.focus.textColor};
            border-color: ${({ theme }) => theme.base.borderColor};
            background: ${({ theme }) => theme.base.focus.background};
        }
        &.rbc-active {
            color: ${({ theme }) => theme.base.textColor};
            border-color: ${({ theme }) => theme.base.borderColor};
            background: ${({ theme }) => theme.base.active.background};
            &:hover {
                color: ${({ theme }) => theme.base.active.textColor};
                border-color: ${({ theme }) => theme.base.borderColor};
                background: ${({ theme }) => theme.base.active.background};
            }
        }
    }
}

& .rbc-time-header.rbc-overflowing {
    margin-right: 6px !important;
}

& .rbc-month-view,
& .rbc-time-view,
& .rbc-header,
& .rbc-time-header,
& .rbc-time-header.rbc-overflowing,
& .rbc-month-view .rbc-header + .rbc-header,
& .rbc-time-header > .rbc-row > * + *,
& .rbc-time-header > .rbc-row:first-child,
& .rbc-date-cell,
& .rbc-day-bg + .rbc-day-bg,
& .rbc-month-row + .rbc-month-row,
& .rbc-time-content,
& .rbc-time-content > * + * > *,
& .rbc-agenda-view table,
& .rbc-agenda-view table tbody > tr > td + td,
& .rbc-day-slot .rbc-time-slot,
& .rbc-overlay,
& .rbc-overlay-header
{
    border-color: ${({ theme }) => theme.base.borderColor};
}

& .rbc-event {
    background: ${({ theme }) => theme.color.secondary};
    &.rbc-selected {
        background: ${({ theme }) => theme.color.primary};
    }
}

& .rbc-selected-cell {
    background-color: red;
}

& .rbc-show-more {
    color: ${({ theme }) => theme.base.textColor};
    /* font-size: 0.8rem; */
    background: transparent;
}

& .rbc-today {
    background: ${({ theme }) => darken(0.1, theme.color.background)};
}

& .rbc-current {
    color: white;
}

& .rbc-off-range-bg {
    background: ${({ theme }) => lighten(0.03, theme.color.background)};
}
`;

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);
/**
 * Renders the view to display the classification.
 */
class Calendar extends PureComponent<Object, Object> {

    defaultDate: Date;
    defaultView: string;

    constructor(props: Object) {
        super(props);
        const { calendarState } = props;
        let state = calendarState;
        if (!state) {
            state = this._buildState(props);
            this.saveState(state);
        }
        const { start, end, date, view } = state;
        this.defaultDate = date;
        this.defaultView = view;
        props.onDateRangeChange && props.onDateRangeChange({ start, end });
    }

    _buildState(props: Object) {
        const { defaultDate, defaultView } = props;
        const view = defaultView || 'month';
        const date = defaultDate || new Date();
        const { start, end } = this.calculateDateRange(view, date);
        return { view, date, start, end };
    }

    saveState(partialState: Object) {
        const { calendarState, calendarId, saveCalendarState } = this.props;
        const next = { ...calendarState, ...partialState };
        saveCalendarState(calendarId, next);
    }

    isAllDay = ({ start, end }: Object) =>
        start.getDate() !== end.getDate()
        || start.getMonth() !== end.getMonth()
        || start.getFullYear() !== end.getFullYear()
        || (
            dateEquals(start, setHours(start, 0, 0, 0, 0))
            && dateEquals(end, setHours(start, 23, 59, 59, 999))
        );

    calculateDateRange(view: string, date: Date) {
        let start;
        let end;
        switch (view) {
            case 'day': {
                start = moment(date).startOf('day').toDate();
                end = moment(date).endOf('day').toDate();
                break;
            }
            case 'week': {
                start = moment(date).startOf('week').toDate();
                end = moment(date).endOf('week').toDate();
                break;
            }
            case 'agenda': {
                start = moment(date).startOf('day').toDate();
                end = moment(date).add(30, 'days').endOf('day').toDate();
                break;
            }
            default:
                start = moment(date).startOf('month').subtract(7, 'days').toDate();
                end = moment(date).endOf('month').add(7, 'days').toDate();
        }
        return { start, end };
    }

    onDateRangeChange({ start, end, prevStart, prevEnd }) {
        if (start < prevStart || prevEnd < end) {
            this.props.onDateRangeChange && this.props.onDateRangeChange({ start, end });
        }
    }

    onView = (view: string /* 'month'|'week'|'work_week'|'day'|'agenda' */) => {
        const { date, start: prevStart, end: prevEnd } = this.props.calendarState;
        const { start, end } = this.calculateDateRange(view, date);
        this.saveState({ view, start, end });
        this.props.onView && this.props.onView(view);
        this.onDateRangeChange({ start, end, prevStart, prevEnd });
    }

    onNavigate = (date: Date) => {
        const { view, start: prevStart, end: prevEnd } = this.props.calendarState;
        const { start, end } = this.calculateDateRange(view, date);
        this.saveState({ date, start, end });
        this.props.onNavigate && this.props.onNavigate(date);
        this.onDateRangeChange({ start, end, prevStart, prevEnd });
    }

    render(): Object {
        return (
            <Fragment>
                { this.props.isLoading && <Loader absolute />}
                <StyledBigCalendar
                    startAccessor="start"
                    endAccessor="end"
                    defaultDate={this.defaultDate}
                    defaultView={this.defaultView}
                    allDayAccessor={this.isAllDay}
                    {...this.props}
                    onNavigate={this.onNavigate}
                    onView={this.onView}
                />
            </Fragment>
        );
    }
}


export default connect((state, props) => ({
    userProfile: state.user.profile,
    tasks: state.abox.task.calendar.records,
    isLoading: state.abox.task.calendar.isLoading,
    calendarState: get(state, `common.calendar.state.${props.calendarId}`),
}), { saveCalendarState })(Calendar);

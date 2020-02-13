/* @flow */

import memoize from 'memoize-one';

import { gantt } from 'dhtmlx-gantt';
import { createInitials, generateColor } from 'app/utils/avatar/avatar';
import affectliSso from 'app/auth/affectliSso';
import theme from 'app/themes/theme.default';
import { formatDate } from '../date/date';
import { getPriorityLabel } from 'app/config/aboxConfig';

const formatDayStr = gantt.date.date_to_str('%D'); 
const formatDayNum = gantt.date.date_to_str('%d');
const formatFullDate = gantt.date.date_to_str('%d/%m/%Y');
const formatHour = gantt.date.date_to_str('%H');
const formatWeek = gantt.date.date_to_str('%W');
const formatHourMin = gantt.date.date_to_str('%H:%i');
const formatMonth = gantt.date.date_to_str('%M');

const hourScaleTemplate = (date: any) => {
    const dateToday = formatFullDate(new Date());
    const dateFromScale = formatFullDate(new Date(date));
    const hourScale = formatHour(new Date(date));
    const hourTodayScale = formatHour(new Date());

    const isCurrentDate = ((dateToday === dateFromScale) && hourScale === hourTodayScale) ? ' date-scale--highlight': '';
    
    return `
        <div class="date-scale${isCurrentDate}">
            <div class="date-scale__num">${formatHourMin(date)}</div>
        </div>
    `;
};

const dayScaleTemplate = (date: any) => {
    const dateToday = formatFullDate(new Date());
    const dateFromScale = formatFullDate(new Date(date));

    const isCurrentDate = (dateToday === dateFromScale) ? ' date-scale--highlight': '';

    return `
        <div class="date-scale${isCurrentDate}">
            <div class="date-scale__str">${formatDayStr(date)}</div>
            <div class="date-scale__num">${formatDayNum(date)}</div>
        </div>
    `;
};

const weekScaleTemplate = (date: any) => {
    var endDate = gantt.date.add(gantt.date.add(date, 1, 'week'), -1, 'day');

    return `
        <div class="date-scale">
            <div class="date-scale__str">Week #${formatWeek(date)}</div>
            <div class="date-scale__num">${formatDayNum(date) + ' - ' + formatDayNum(endDate)}</div>
        </div>
    `;
};

const monthScaleTemplate = (date: any) => {
    return `
        <div class="date-scale">
            <div class="date-scale__num">${formatMonth(date)}</div>
        </div>
    `;
};

const taskAvatar = memoize((assignee) => {
    if (assignee) {
        if (assignee.image) {
            const src = assignee.image;
            const withAuthSrc = src.startsWith('data:') ? src : `${src}?access_token=${affectliSso.getToken() || ''}`;
            return `<img src="${withAuthSrc}" alt="avatar"/>`;
        }

        const initials = createInitials(assignee.name);
        const bg = generateColor(Object.values(theme.statusColors), assignee.name);

        if (typeof bg === 'string') {
            return `<div class="task-template__avatar__icon" style="background: ${bg}">${initials}</div>`;
        }
    } else {
        return `<img src="'/temp/img/avatar-default.jpg'" alt="avatar"/>`;
    }
});

const taskTemplate = (task: Object) => {
    return `
        <div class="task-template">
            <div class="task-template__avatar">
                ${taskAvatar(task.assignee)}
            </div>
            <div class="task-template__info">
               <h3>
                    <a href="javascript:void(0)">${task.text}</a>
               </h3>
               <h4>
                    <a href="javascript:void(0)">#${task.id}</a>
               </h4>
            </div>
        </div>
    `;
};

const gridTaskTemplate = (task: Object) => {
    return `
        <div class="task-template grid-template">
            <div class="task-template__info">
               <h3>
                    <a href="javascript:void(0)" target="_blank">${task.text}</a>
               </h3>
               <h4>
                    <a href="javascript:void(0)" target="_blank">#${task.id}</a>
               </h4>
            </div>
        </div>
    `;
};

const gridTaskStartDateTemplate = (task: Object) => {
    return formatDate(task.start_date, 'DD-MM-YYYY');
};

const gridTaskEndDateTemplate = (task: Object) => {
    return formatDate(task.end_date, 'DD-MM-YYYY');
};

const tooltipTemplate = (task: Object) => {
    const startDate = formatDate(task.start_date, 'DD-MM-YYYY HH:mm');
    const endDate = formatDate(task.end_date, 'DD-MM-YYYY HH:mm');

    return `
        <div class="tooltip-template">
            <b>Assignee: </b>${task.assignee ? task.assignee.name : 'No Assignee' }<br/>
            <b>Progress: </b>${task.progress * 100}%<br/>
            <b>Priority: </b>${getPriorityLabel(task.priority)}<br/>
            <b>Start Date: </b>${startDate}<br/>
            <b>Due Date: </b>${endDate}<br/>
        </div>
    `;
};

export {
    hourScaleTemplate,
    dayScaleTemplate,
    weekScaleTemplate,
    monthScaleTemplate,
    taskAvatar,
    taskTemplate,
    gridTaskTemplate,
    tooltipTemplate,
    gridTaskStartDateTemplate,
    gridTaskEndDateTemplate
};
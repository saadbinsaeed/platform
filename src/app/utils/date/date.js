/* @flow */

import moment from 'moment';
import { datefy } from 'app/utils/utils';

export const DATETIME_FORMAT = 'DD MMM YYYY, H:mm';
export const DATE_FORMAT = 'DD MMM YYYY';
export const DATETIME_DISPLAY_FORMAT = 'DD MMM YYYY HH:mm';
export const DATETIME_SAVE_FORMAT = '';
export const DATE_DISPLAY_FORMAT = 'DD MMM YYYY';
export const DATE_SAVE_FORMAT = 'YYYYMMDD';
export const TIME_DISPLAY_FORMAT = 'HH:mm';
export const TIME_SAVE_FORMAT = 'HHmmssZ';
export const TIME_SAVE_REGEXPR = /[0-9]{6}\+[0-9]{2}:[0-9]{2}/;

const kindFormatMap = {
    time: [TIME_SAVE_FORMAT, TIME_DISPLAY_FORMAT],
    date: [DATE_SAVE_FORMAT, DATE_DISPLAY_FORMAT],
    datetime: [DATETIME_SAVE_FORMAT, DATETIME_DISPLAY_FORMAT]
};

export const displayByKind = (kind: string, value: string) => {
    if (!value) return value;
    const [save, display] = kindFormatMap[kind] || kindFormatMap.datetime;
    return moment(value, save).format(display);
};

export const saveByKind = (kind: string, value: ?Date) => {
    if (!value) return value;
    const [save] = kindFormatMap[kind] || kindFormatMap.datetime;
    return moment(value).format(save);
};

export const formatByKind = (kind: string, value: ?string) => {
    if (!value) return value;
    const [save] = kindFormatMap[kind] || kindFormatMap.datetime;
    const formatted = moment(value, save);
    return formatted.isValid() ? formatted : null;
};

/**
 * Formats a date.
 *
 * @param date the date to format (can be null or undefined)
 * @param format the format to use (optional)
 */
export const formatDate = (date: ?Date, format: ?string ) =>
    date ? moment(date).format(format || DATETIME_FORMAT) : '';

export const fromNow = (date: ?Date ) =>
    date ? moment(date).fromNow() : '';


export const resetTime = (date: Date) => {
    if (!date) {
        return date;
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const isIsoDate = (date: any) => date
    && typeof date === 'string'
    && (date.length === 24 || date.length === 25)
    && date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/);

/**
 * Returns a new date object that is a clone of the given one.
 */
export const clone = (date: ?mixed) => {
    const parsedDate = datefy(date);
    return parsedDate && parsedDate === date ? new Date(parsedDate) : parsedDate;
};

/**
 * Returns true if the specified dates are refering to the same instant, false otherwise.
 */
export const equals = (dateA: ?mixed, dateB: ?mixed) => {
    const parsedDateA = datefy(dateA);
    const parsedDateB = datefy(dateB);
    if (!parsedDateA && !parsedDateB) {
        return true;
    }
    if (!parsedDateA || !parsedDateB) {
        return false;
    }
    return parsedDateA.getTime() === parsedDateB.getTime();
};


/**
 * Returns a new date object that is a clone of the given one with the given hours, minutes, seconds and ms.
 */
export const setHours = (date: ?mixed, hours: number, minutes?: number, seconds?: number, ms?: number) => {
    const newDate = clone(date);
    if (newDate) {
        newDate.setHours(hours, minutes, seconds, ms);
    }
    return newDate;
};

/**
 * Returns a new date object that is a clone of the given one with the given seconds and ms.
 */
export const setSeconds = (date: ?mixed, seconds: number, ms?: number) => {
    const newDate = clone(date);
    if (newDate) {
        newDate.setSeconds(seconds, ms);
    }
    return newDate;
};


export const formatInterval = (milliseconds: number) => {
    if (Math.trunc(milliseconds / 1000) < 60) {
        return 'less than a minute';
    }
    const interval = moment.duration(milliseconds);
    let days = interval.days();
    let minutes = interval.minutes();
    days = !days ? '' : days === 1 ? '1 day' : `${days} days`;
    minutes = !minutes ? '' : minutes === 1 ? '1 minute' : `${minutes} minutes`;
    return [days, minutes].filter(t => t).join(', ');
};

/* @flow */

import Moment from 'moment';

/**
 * Return the difference between now and the given date.
 */
const DateDifferenceRenderer = ( { value }: Object ) => value ? Moment(value).from(Moment()) : null;

export default DateDifferenceRenderer;

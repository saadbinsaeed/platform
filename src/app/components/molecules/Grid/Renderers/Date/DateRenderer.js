/* @flow */

import { formatDate } from 'app/utils/date/date';

/**
 * @public
 * Format a date.
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const DateRenderer = ({ value }: Object) => formatDate(value);

export default DateRenderer;

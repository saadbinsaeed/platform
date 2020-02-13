/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

import Link from 'app/components/atoms/Link/Link';

/**
 * Renders a link to navigate to the specified Thing
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const TaskLinkRenderer = ({ value, data }: Object) => value ? <Link to={`/abox/task/${data.id}`}>{value}</Link> : null;

TaskLinkRenderer.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    data: PropTypes.object, // the Thing ID
};


export default TaskLinkRenderer;

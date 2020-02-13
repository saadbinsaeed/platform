/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';


/**
 * Renders a link to navigate to the Classification's details view.
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const ClassificationLink: Function = ({ id, label }: Object ): ?Object => {
    return !id || !label ? null : <Link to={`/classifications/${encodeURIComponent(id)}/about`}> {label}</Link>;
};

ClassificationLink.propTypes = {
    label: PropTypes.any,
    id: PropTypes.number,
};

export default ClassificationLink;

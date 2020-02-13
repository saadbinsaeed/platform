/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

import Link from './Link';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';


/**
 * Renders a hyper link
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const HyperLink = ({ text, url, internal }: Object) => {
    if (!text) {
        return null;
    }
    return internal ?
        (<Link to={url}>{text}</Link>)
        :
        (<a href={url}>{text}</a>);
};

export default compose(
    onlyUpdateForKeys(['text', 'url', 'internal']),
    setPropTypes({
        text: PropTypes.string,
        url: PropTypes.string,
        internal: PropTypes.bool,
    })
)(HyperLink);

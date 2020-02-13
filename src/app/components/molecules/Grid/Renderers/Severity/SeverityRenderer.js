/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

import RoundedIndicator from 'app/components/atoms/RoundedIndicator/RoundedIndicator';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';


const style = { display: 'inline-block' };

/**
 * @public
 * Renders severity number in an indicator
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const SeverityRenderer = ( props: Object ) => {
    const { value } = props;

    let color = '';

    // Set the color based on the theme vars
    switch (value) {
        case 0:
            color = 'success';
            break;
        case 1:
            color = 'error';
            break;
        case 2:
            color = 'alert';
            break;
        case 3:
            color = 'warning';
            break;
        case 4:
            color = 'info';
            break;
        default:
            color = 'success';
    }

    return <div style={style}> <RoundedIndicator color={color} count={value} /> </div>;
};

export default compose(onlyUpdateForKeys(['value']), setPropTypes({
    value: PropTypes.number,
}))(SeverityRenderer);

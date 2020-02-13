/* @flow */

import React from 'react';
import Icon from 'app/components/atoms/Icon/Icon';
import PropTypes from 'prop-types';

/**
 * @public
 * Format a boolean value.
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const BooleanRenderer: Function = ({ value, isTrue }: Object ): ?Object => {
    if (isTrue) {
        return isTrue(value) ? <Icon name="checkbox-marked" /> : <Icon name="checkbox-blank-outline" />;
    }
    return value ? <Icon name="checkbox-marked" /> : <Icon name="checkbox-blank-outline" />;
};
BooleanRenderer.propTypes = {
    value: PropTypes.any,
    isTrue: PropTypes.func,
};

export default BooleanRenderer;

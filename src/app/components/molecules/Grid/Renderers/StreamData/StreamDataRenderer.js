/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * @public
 * Renders stream id
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const StreamDataRenderer = ( { value, data, textOnly=false }: Object ) => {
    const json = value || {};
    const displayExpressions = ( data && data.eventType.displayExpression ) || [];

    const filteredValues = displayExpressions.filter((filteredValue) => {
        return filteredValue.value !== 'impact' && filteredValue.label !== ' Impact:';
    });
    let key = 1;
    const fields = filteredValues.map((desc) => {
        const text = desc.label || json[desc.value];
        if (textOnly) {
            return text;
        }
        switch (desc.style) {
            case 'strong':
                return <strong key={String(key++)}>{`${text} `}</strong>;
            default:
                return <span key={String(key++)}>{`${text} `}</span>;
        }
    });
    return textOnly ? fields.join('') : <div> {fields} </div>;
};

StreamDataRenderer.propTypes = {
    value: PropTypes.object,
    data: PropTypes.object,
    textOnly: PropTypes.bool,
};

StreamDataRenderer.defaultProps = {
    value: {},
};

export default StreamDataRenderer;

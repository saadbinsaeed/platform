/* @flow */

import React from 'react';

/**
 * @public
 * Renders event type
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const EventTypeRenderer: Function = ( props: Object ): Object => {
    return <div>{String(props.value || '').replace(/^(.*)([A-Z].+)$/g, '$1 $2')}</div>;
};

export default EventTypeRenderer;

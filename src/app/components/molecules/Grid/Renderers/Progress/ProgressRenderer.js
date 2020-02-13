/* @flow */

import React from 'react';
import { onlyUpdateForKeys } from 'recompose';

import AboxCircularProgressBar from 'app/components/atoms/CircularProgressBar/AboxCircularProgressBar';
import { get } from 'app/utils/lo/lo';
/**
 * @public
 * Renders severity number in an indicator
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const ProgressRenderer = onlyUpdateForKeys(['value', 'data'])((props: Object) => {
    /**
     * Render our progress bar based on % value
     */
    const { value, data, data: { endDate }, foreignObjectContent, ...restProps } = props;
    const priority = get(data, 'variables.priority') || get(data, 'priority') || 3;
    // If process have end date it means that process is closed
    return <AboxCircularProgressBar {...restProps} percentage={value} priority={priority} disabled={!!endDate} foreignObjectContent={foreignObjectContent} />;
});

export default ProgressRenderer;

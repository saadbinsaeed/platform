/* @flow */

import React from 'react';
import { withTheme } from 'styled-components';

import RoundedIndicator from 'app/components/atoms/RoundedIndicator/RoundedIndicator';
import { getPriorityColor } from 'app/config/aboxConfig';

/**
 * @public
 * Renders severity number in an indicator
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const PriorityRenderer = (props: Object) => {
    /**
     * Render our progress bar based on % value
     */
    const { value, data: { endDate }, theme } = props;
    const val = Number(value); // BE sometimes sends priority in a string format
    const validatedPriority = val && val >= 1 && val <= 5 ? val : 3;
    const priorityColor = endDate ? 'disabled' : getPriorityColor(validatedPriority);
    return (
        <div style={{ display: 'inline-block' }}>
            {' '}
            <RoundedIndicator colorHex={theme.priorityColors[priorityColor]} count={validatedPriority} />{' '}
        </div>
    );
};

export default withTheme(PriorityRenderer);

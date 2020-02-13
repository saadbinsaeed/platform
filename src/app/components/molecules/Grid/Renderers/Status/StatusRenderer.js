/* @flow */

import React from 'react';
import { onlyUpdateForKeys } from 'recompose';

import Icon from 'app/components/atoms/Icon/Icon';

/**
 * @public
 * Renders event status
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const StatusRenderer = ( { value } = {} ): ?Object => {
    return {
        'UNA': <Icon name="radiobox-blank" alt="Unacknowledged" title="Unacknowledged" size="lg" color="info" data-tip="Unacknowledged" />,
        'ACK': <Icon name="radiobox-marked" alt="Acknowledged" title="Acknowledged" size="lg" color="primary" data-tip="Acknowledged" />,
        'PRO': <Icon name="check-circle" alt="Processed" title="Processed" size="lg" color="primary" data-tip="Processed" />,
        'DUP': <Icon name="plus-circle-multiple-outline" alt="Duplicate" title="Duplicate" size="lg" color="error" data-tip="Duplicate" />,
        'DIS': <Icon name="delete" size="lg" alt="Discarded" title="Discarded" color="info" data-tip="Discarded" />,
        'ERR': <Icon name="alert-circle" size="lg" alt="Error" title="Error" color="error" data-tip="Error" />,
        'CLE': <Icon name="check-all" size="lg" alt="Cleared" title="Cleared" color="primary" data-tip="Cleared" />,
    }[value];
};

export default onlyUpdateForKeys(['value'])(StatusRenderer);

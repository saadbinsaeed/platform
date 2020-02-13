/* @flow */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';

import EventStartProcess from 'app/containers/Stream/Events/EventActions/EventStartProcess';
import EventUpdateStatus from 'app/containers/Stream/Events/EventActions/EventUpdateStatus';
import ProcessRenderer from 'app/components/molecules/Grid/Renderers/Process/ProcessRenderer';
import { get } from 'app/utils/lo/lo';

/**
 * @public
 * Renders buttons to update the event status
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const EventActionRenderer = ({ data, color, canEdit, refresh }: Object) => {
    if (!data) {
        return null;
    }
    const { id, processInstances } = data;
    const processDefinitions = get(data, 'eventType.processDefinitions') || [];
    const element = (
        <Fragment>
            { canEdit && <EventUpdateStatus eventId={id} status="ACK" color={color} postAction={refresh} /> }
            { canEdit && <EventUpdateStatus eventId={id} status="DIS" color={color} postAction={refresh} /> }
            { canEdit && <EventStartProcess eventId={id} processDefinitions={processDefinitions} color={color} postAction={refresh} /> }
            <ProcessRenderer eventId={id} processInstances={processInstances} color={color} />
        </Fragment>
    );
    return element;
};

export default compose(onlyUpdateForKeys(['data', 'color', 'canEdit', 'refresh']), setPropTypes({
    data: PropTypes.object.isRequired,
    color: PropTypes.string,
    canEdit: PropTypes.bool,
    refresh: PropTypes.func,
}))(EventActionRenderer);

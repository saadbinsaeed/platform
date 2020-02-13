/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import ThingAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/ThingAvatarRenderer';
import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import OrganisationAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/OrganisationAvatarRenderer';
import CustomEntityAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/CustomEntityAvatarRenderer';
import ProcessAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/ProcessAvatarRenderer';
import TaskAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/TaskAvatarRenderer';

const EntityAvatarRenderer = (props: Object) => {
    switch (props.data.type || props.type) {
        case 'thing': return <ThingAvatarRenderer {...props} />;
        case 'person': return <PersonAvatarRenderer {...props} />;
        case 'organisation': return <OrganisationAvatarRenderer {...props} />;
        case 'custom': return <CustomEntityAvatarRenderer {...props} />;
        case 'process': return <ProcessAvatarRenderer {...props} />;
        case 'task': return <TaskAvatarRenderer {...props} />;
        default: return <span>{props.value}</span>;
    }
};

EntityAvatarRenderer.propTypes = {
    value: PropTypes.any,
    data: PropTypes.object,
    idProperty: PropTypes.string,
    imageProperty: PropTypes.string,
};

export default pure(EntityAvatarRenderer);

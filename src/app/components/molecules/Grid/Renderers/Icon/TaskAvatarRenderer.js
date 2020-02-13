/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import AvatarRenderer from './AvatarRenderer';

const linkGenerator = id => `/abox/task/${id}`;

/**
 * Renders a entity Icon and it's name.
 *
 */
const TaskAvatarRenderer = (props: Object ) =>
    <AvatarRenderer
        {...props}
        linkGenerator={linkGenerator}
    />;

TaskAvatarRenderer.propTypes = {
    value: PropTypes.any,
    data: PropTypes.object,
    idProperty: PropTypes.string,
    imageProperty: PropTypes.string,
    nameProperty: PropTypes.string,
};

export default pure(TaskAvatarRenderer);

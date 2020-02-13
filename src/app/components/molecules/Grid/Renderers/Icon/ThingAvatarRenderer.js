/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import AvatarRenderer from './AvatarRenderer';

const linkGenerator = id => `/things/${id}`;

/**
 * Renders a entity Icon and it's name.
 *
 */
const ThingAvatarRenderer = (props: Object ) =>
    <AvatarRenderer
        {...props}
        linkGenerator={linkGenerator}
    />;

ThingAvatarRenderer.propTypes = {
    value: PropTypes.any,
    data: PropTypes.object,
    idProperty: PropTypes.string,
    imageProperty: PropTypes.string,
    nameProperty: PropTypes.string,
};

export default pure(ThingAvatarRenderer);

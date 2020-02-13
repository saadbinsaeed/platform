/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import AvatarRenderer from './AvatarRenderer';

const linkGenerator = id => `/people/${id}`;

/**
 * Renders a entity Icon and it's name.
 */
const PersonAvatarRenderer = (props: Object ) =>
    <AvatarRenderer
        {...props}
        linkGenerator={linkGenerator}
    />;

PersonAvatarRenderer.propTypes = {
    value: PropTypes.any,
    data: PropTypes.object,
    idProperty: PropTypes.string,
    imageProperty: PropTypes.string,
};

export default pure(PersonAvatarRenderer);

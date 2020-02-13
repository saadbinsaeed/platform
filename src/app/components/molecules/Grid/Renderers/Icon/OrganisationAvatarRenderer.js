/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import AvatarRenderer from './AvatarRenderer';

const linkGenerator = id => `/organisations/${id}`;

/**
 * Renders a entity Icon and it's name.
 */
const OrganisationAvatarRenderer = (props: Object ) =>
    <AvatarRenderer
        {...props}
        linkGenerator={linkGenerator}
    />;

OrganisationAvatarRenderer.propTypes = {
    value: PropTypes.any,
    data: PropTypes.object,
    idProperty: PropTypes.string,
    nameProperty: PropTypes.string,
    imageProperty: PropTypes.string,
};

export default pure(OrganisationAvatarRenderer);

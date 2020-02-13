/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import AvatarRenderer from './AvatarRenderer';

const linkGenerator = id => `/classifications/${id}`;

/**
 * Renders a entity Icon and it's name.
 */
const ClassificationAvatarRenderer = ({ data, value, idProperty, nameProperty, imageProperty }: Object ) =>
    <AvatarRenderer
        linkGenerator={linkGenerator}
        data={data}
        value={value}
        nameProperty={nameProperty}
        imageProperty={imageProperty}
        idProperty={idProperty}
    />;

ClassificationAvatarRenderer.propTypes = {
    value: PropTypes.any,
    data: PropTypes.object,
    idProperty: PropTypes.string,
    imageProperty: PropTypes.string,
};

export default pure(ClassificationAvatarRenderer);

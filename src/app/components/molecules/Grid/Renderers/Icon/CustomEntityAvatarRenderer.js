/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys, compose, setPropTypes } from 'recompose';
import AvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/AvatarRenderer';

const linkGenerator = id => `/custom-entities/${id}`;


const CustomEntityAvatarRenderer = (props: Object ) => {
    return (
        <AvatarRenderer
            {...props}
            linkGenerator={linkGenerator}
        />
    );
};

export default compose(onlyUpdateForKeys(['value']), setPropTypes({
    value: PropTypes.string,
    data: PropTypes.object,
    idProperty: PropTypes.string,
    imageProperty: PropTypes.string,
    nameProperty: PropTypes.string,
}))(CustomEntityAvatarRenderer);

/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys, compose, setPropTypes } from 'recompose';

import Link from 'app/components/atoms/Link/Link';

const ThingLink = ((props: Object) => {
    const { id, children, ...restProps } = props;
    return <Link to={`/things/${id}`} {...restProps}>{children}</Link>;
});

export default compose(onlyUpdateForKeys(['id']), setPropTypes({
    id: PropTypes.number.isRequired,
}))(ThingLink);

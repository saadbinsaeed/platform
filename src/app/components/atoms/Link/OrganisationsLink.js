/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys, compose, setPropTypes } from 'recompose';

import Link from 'app/components/atoms/Link/Link';

const OrganisationsLink = ((props: Object) => {
    const { id, children, ...restProps } = props;
    return <Link to={`/organisations/${id}`} {...restProps}>{children}</Link>;
});

export default compose(onlyUpdateForKeys(['id']), setPropTypes({
    id: PropTypes.number.isRequired,
}))(OrganisationsLink);

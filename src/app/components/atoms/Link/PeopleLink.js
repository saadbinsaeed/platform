/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys, compose, setPropTypes } from 'recompose';

import Link from 'app/components/atoms/Link/Link';

const PeopleLink = ((props: Object) => {
    const { id, children, title, ...restProps } = props;
    return <Link title={title} to={`/people/${id}`} {...restProps}>{children}</Link>;
});

export default compose(onlyUpdateForKeys(['id']), setPropTypes({
    id: PropTypes.number.isRequired,
}))(PeopleLink);

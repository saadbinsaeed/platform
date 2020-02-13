/* @flow */
// $FlowFixMe
import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Link from 'app/components/atoms/Link/Link';

const TaskLink = ((props: Object) => {
    const { id, children, noDecoration, path, ...restProps } = props;
    const extraPath = path ? `/${path}` : '';
    return <Link to={`/abox/task/${id}${extraPath}`} noDecoration={noDecoration} {...restProps}>{children}</Link>;
});

TaskLink.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    noDecoration: PropTypes.bool,
    path: PropTypes.string,
};

export default memo(TaskLink);

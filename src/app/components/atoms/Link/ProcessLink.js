/* @flow */

// $FlowFixMe
import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Link from 'app/components/atoms/Link/Link';

const ProcessLink = ((props: Object) => {
    const { id, children, path, noDecoration, ...restProps } = props;
    const extraPath = path ? `/${path}` : '';
    return <Link to={`/abox/process/${id}${extraPath}`} noDecoration={noDecoration} {...restProps}>{children}</Link>;
});

ProcessLink.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    noDecoration: PropTypes.bool,
    children: PropTypes.node,
};

export default memo(ProcessLink);

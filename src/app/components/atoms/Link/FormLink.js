/* @flow */

// $FlowFixMe
import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Link from 'app/components/atoms/Link/Link';

const FormLink = ((props: Object) => {
    const { id, children, ...restProps } = props;
    return <Link to={`/designer/form/${id}`} {...restProps}>{children}</Link>;
});

FormLink.propTypes = {
    id: PropTypes.number.isRequired,
};

export default memo(FormLink);

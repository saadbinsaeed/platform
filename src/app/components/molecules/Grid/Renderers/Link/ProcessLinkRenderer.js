/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { getStr } from 'app/utils/utils';

import Link from 'app/components/atoms/Link/Link';

/**
 * Renders a link to navigate to the specified Thing
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const ProcessLinkRenderer = (props: Object) => {
    const { value, data, field } = props;
    if (!value) {
        return null;
    }
    if (field){
        const id = getStr(data, field) || '';
        return <Link to={`/abox/process/${id}`}>{value}</Link>;
    }
    return <Link to={`/abox/process/${data.id}`}>{value}</Link>;
};

ProcessLinkRenderer.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};


export default ProcessLinkRenderer;

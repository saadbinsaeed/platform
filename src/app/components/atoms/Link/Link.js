/* @flow */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LinkStyle = styled(RouterLink)`
${({ nodecoration }) => nodecoration ? 'text-decoration: none;' : ''}
`;

const Link = (props: Object) => {
    const { noDecoration, ...linkProps } = props; // eslint-disable-line no-unused-vars
    return <LinkStyle {...linkProps} nodecoration={noDecoration ? 1 : 0} />;
};

Link.propTypes = {
    noDecoration: PropTypes.bool,
};

export default Link;

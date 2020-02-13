/* @flow */

// $FlowFixMe
import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const FlexStyle = styled.div`
    display: flex;
    align-items: ${ ( { alignItems } ) => alignItems || 'center' };
    ${ ( { spaceBetween } ) => spaceBetween ? 'justify-content: space-between' : '' };
    ${ ( { spaceAround } ) => spaceAround ? 'justify-content: space-around' : '' };
    ${ ( { center } ) => center ? 'justify-content: center' : '' };
    ${ ( { grow } ) => grow ? 'flex-grow: 1' : '' };
    ${ ( { wrap } ) => wrap ? 'flex-wrap: wrap' : '' };

`;

const Flex = ({ grow, wrap, center, spaceBetween, spaceAround, ...restProps}) =>
    <FlexStyle
        {...restProps}
        wrap={wrap?1:0}
        grow={grow?1:0}
        spaceBetween={spaceBetween?1:0}
        spaceAround={spaceAround?1:0}
        center={center?1:0}
    />;

Flex.propTypes = {
    spaceBetween: PropTypes.bool,
    spaceAround: PropTypes.bool,
    grow: PropTypes.bool,
    center: PropTypes.bool,
    wrap: PropTypes.bool,
    alignItems: PropTypes.string,
};

export default memo(Flex);

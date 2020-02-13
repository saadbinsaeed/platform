// @flow
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';


const CollapsedContentStyle = styled.div`
    transition: max-height .25s linear;
    max-height: ${({ opened }) => opened ? 'inherit' : '0px'};
    overflow: ${({ opened }) => opened ? 'inherit' : 'hidden'};
    width: 100%;
`;

const CollapsedContent = ({ children, opened }) => (
    <CollapsedContentStyle opened={opened}>
        {children}
    </CollapsedContentStyle>
);

export default compose(
    onlyUpdateForKeys(['children', 'opened']),
    setPropTypes({
        opened: PropTypes.bool,
        children: PropTypes.any,
    })
)(CollapsedContent);

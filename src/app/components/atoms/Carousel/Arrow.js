/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';

import Icon from 'app/components/atoms/Icon/Icon';

const ArrowStyle = styled.button`
    position: absolute;
    top: 2rem;
    cursor: pointer;
    border: none;
    background: transparent;
    ${({ right }) => right ? 'right: 5px' : 'left: 3px'};
`;


const Arrow = ({ name, right, onClick, responsiveConfig }: Object) => (
    <ArrowStyle responsiveConfig={responsiveConfig} right={right} onClick={onClick}>
        <Icon name={right ? 'arrow-right' : 'arrow-left'} />
    </ArrowStyle>
);

export default compose(
    onlyUpdateForKeys(['name']),
    setPropTypes({
        name: PropTypes.string,
    })
)(Arrow);

/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { pure } from 'recompose';

const Indicator = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid;
    border-color: ${({ color, theme }) => (theme && color ? theme.color[color] : theme.color.danger)};
    box-shadow: ${({ shadow, theme }) => (theme && shadow ? theme.shadow.z1 : '')};
    border-right-color: transparent;
    background-color: transparent;
    height: 2.5rem;
    width: 2.5rem;
    font-size: 0.8rem;
    border-radius: 75px;
`;

const RoundedBarIndicator = ({ count, color, shadow, ...rest }: Object) => (
    <Indicator count={count} color={color} shadow={shadow} {...rest}>
        {count}%
    </Indicator>
);

RoundedBarIndicator.propTypes = {
    count: PropTypes.number,
    color: PropTypes.string,
    shadow: PropTypes.bool,
};

RoundedBarIndicator.defaultProps = {
    count: 0,
    color: 'primary',
    shadow: false,
};

export default pure(RoundedBarIndicator);

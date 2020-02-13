/* @flow */

import React from 'react';
import { pure } from 'recompose';
import styled from 'styled-components';

const TooltipStyled = styled.div`
    position: relative;
    [alt]::after {
        content: attr(alt);
        position: absolute;
        transform: translateX(${({x}) => x || x === 0 ? x : -50}%) translateY(${({y}) => y || y === 0 ? y : -100}%);
        background: rgba(25, 25, 25, 0.85);;
        text-align: center;
        color: #fff;
        padding: 4px 2px;
        font-size: 12px;
        border-radius: 5px;
        pointer-events: none;
        padding: 4px 4px;
        z-index: 99;
        opacity: 0;
        margin-left: -10px;
    }
    [alt]:hover::after,[alt]:hover::before {
       opacity:1
    }
`;

const Tooltip = pure(({ children, x, y, ...restProps }: Object) => {
    return <TooltipStyled x={x} y={y} {...restProps}>{children}</TooltipStyled>;
});

export default Tooltip;

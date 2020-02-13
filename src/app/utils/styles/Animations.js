import { css, keyframes } from 'styled-components';

// Animate in from top
const animateInTopKeyframes = keyframes`
     from {
        transform: translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateY(0px);
        opacity: 1;
    }
`;

const animateOutTopKeyframes = keyframes`
     from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(-100%);
        opacity: 0;
    }
`;

export const animateInTop = css`
    ${animateInTopKeyframes};
`;
export const animateOutTop = css`
    ${animateOutTopKeyframes};
`;

// Animate in from right
const animateInRightKeyframes = keyframes`
     from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0px);
    }
`;

const animateOutRightKeyframes = keyframes`
     from {
        transform: translateX(0);
    }
    to {
        transform: translateX(100%);
    }
`;

export const animateInRight = css`
    ${animateInRightKeyframes};
`;
export const animateOutRight = css`
    ${animateOutRightKeyframes};
`;

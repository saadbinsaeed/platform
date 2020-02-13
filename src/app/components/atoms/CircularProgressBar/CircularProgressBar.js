/* @flow */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ProgressContainer = styled.div`
    .circle-background {
        stroke: ${({ color, theme }) => color ? `${color}44` : '#adabab'};

    }

    .circle-progress {
        stroke: ${({ color, theme }) => color || 'white'};
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .circle-text {
        font-size: 0.8rem;
        fill: white;
    }
    svg {
        display: block;
    }
`;


const CircularProgressBar = (props: Object) => {
    const { size, foreignObjectContent, ...restProps } = props;
    const percentage = props.percentage >= 0 && props.percentage <= 100 ? Math.round(props.percentage) : 0;
    const radius = (props.size - props.borderWidth) / 2;
    const viewBox = `0 0 ${size} ${size}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * percentage) / 100;
    const content = foreignObjectContent ? (
        <foreignObject x="7" y="1" width="25" height="30">
            {foreignObjectContent}
        </foreignObject>
    ) : (
        <text className="circle-text" x="50%" y="50%" dy=".3em" textAnchor="middle">
            {`${percentage}%`}
        </text>
    );
    return (
        <ProgressContainer {...restProps} color={props.color}>
            <svg width={props.size} height={props.size} viewBox={viewBox} fill="none">
                <circle className="circle-background" cx={props.size / 2} cy={props.size / 2} r={radius} strokeWidth={`${props.borderWidth}px`} />
                <circle
                    className="circle-progress"
                    cx={props.size / 2}
                    cy={props.size / 2}
                    r={radius}
                    strokeWidth={`${props.borderWidth}px`}
                    // Start progress marker at 12 O`Clock
                    transform={`rotate(-90 ${props.size / 2} ${props.size / 2})`}
                    style={{
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset,
                    }}
                />
                {content}
            </svg>
        </ProgressContainer>
    );
};

CircularProgressBar.defaultProps = {
    size: 38,
    borderWidth: 3,
    percentage: 0,
    color: 'white',
};

CircularProgressBar.propTypes = {
    size: PropTypes.number,
    borderWidth: PropTypes.number,
    percentage: PropTypes.number,
    color: PropTypes.string,
    foreignObjectContent: PropTypes.object,
};

export default CircularProgressBar;

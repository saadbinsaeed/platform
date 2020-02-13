/* @flow */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import Backdrop from 'app/components/atoms/Backdrop/Backdrop';

const rotate = keyframes`
   100% {
        transform: rotate(360deg);
    }
`;
const dash = keyframes`
 0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
`;

const smallloadercolors = keyframes`
100%,
    0% {
        stroke: #1b79d1;
    }
    40% {
        stroke: #1bd19a;
    }
    66% {
        stroke: #ff9000;
    }
    80%,
    90% {
        stroke: #e01616;
    }
`;

const LoadWrapper = styled.div`
    display: block; text-align: center; margin: 0 auto;
    ${( { absolute, radius } ) => absolute ? `position: absolute; bottom: calc(50% - ${(radius / 2) || '25px'}); width: 100%; z-index: 10;` : '' };
    ${( { padding } ) => padding ? `padding: ${ padding }` : '' };
`;

const Spinner = styled.div`
    position: relative;
    display: inline-block;
    text-align: center;
    width: 20px;
    height: 20px;
    &:before {
        content: '';
        display: block;
        padding-top: 100%;
    }
`;
const Circle = styled.svg`
    animation: ${rotate} 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
`;

const Path = styled.circle`
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke: ${( { color, theme } ) => theme && color ? theme.color[ color ] : 'transparent' };
    animation: ${dash} 1.5s ease-in-out infinite, ${( { color, theme } ) => theme && color ? null : `${smallloadercolors} 6s ease-in-out infinite` };
    stroke-linecap: round;
`;

/**
 * Our loader/spinner component to add to places requiring a loading state
 */
class Loader extends Component<Object, Object> {
    static propTypes = {
        absolute: PropTypes.bool,
        padding: PropTypes.string,
        radius: PropTypes.string,
        strokeWidth: PropTypes.string,
        color: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object
    };

    /**
     * Return the with/height of the Loader by the given radius prop;
     * @returns {{height: string, width: string}}
     */
    getLoaderStyle() {
        const radius = this.props.radius || 50;
        return {
            height: `${radius}px`,
            width: `${radius}px`,
        };
    }

    /**
     * Set the outer stroke width via the strokeWidth prop;
     * @returns {String|number}
     */
    getStrokeWidth() {
        const strokeWidth = this.props.strokeWidth || 4;
        return strokeWidth;
    }

    /**
     * Render our loader/spinner in SVG
     */
    render() {

        const { absolute, padding, radius, strokeWidth, color, className, style, backdrop } = this.props;
        const BackdropComponent = backdrop ? Backdrop : Fragment;
        return (
            <BackdropComponent>
                <LoadWrapper absolute={absolute} padding={padding} radius={radius} strokeWidth={strokeWidth} color={color} className={`Loader ${className}`} style={style}>
                    <Spinner style={this.getLoaderStyle()}>
                        <Circle viewBox="25 25 50 50">
                            <Path cx="50" cy="50" fill="none" r="20" strokeMiterlimit="10" strokeWidth={this.getStrokeWidth()}></Path>
                        </Circle>
                    </Spinner>
                </LoadWrapper>
            </BackdropComponent>
        );
    }
}

export default Loader;

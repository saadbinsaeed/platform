/* eslint-disable no-nested-ternary */
// LIBRARY IMPORTS
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';


// UI IMPORTS

// STYLE IMPORTS
/**
 * The original plan was to pass the color variable (red, green, blue, primary) and pass that as the background color so it can take the correct color from the theme file.
 * ie theme.color[red]. Theme color red being taken from theme value. So passing name and not hex value.
 * This is basically a quick fix to solve the white background issue. But the implementation of saving colors as hex values is wrong to begin with.
 */
const TagStyle = styled.div`
    display: inline-block;
    font-size: 0.8rem;
    margin: 0.1rem;
    border-radius: 1em;
    color: ${( { color, theme } ) => theme && color ? 'white' : theme.base.textColor };
    background:  ${( { color, theme } ) => theme && color ? (color !== '#ffffff' ? color : theme.color.primary) : theme.color.secondary };
    padding: .2rem .7rem;
    cursor: ${({ onClick }) => onClick ? 'pointer' : 'normal' };
    a, .Icon:before {
         ${( { color, theme } ) => theme && theme.isLightColor(color) &&  'color: #222B2F !important' };
    }
`;


const Tag = (props) => {
    const { name, children, color, className, title, onClick } = props;
    return (
        <TagStyle color={color} className={className} pill title={title} onClick={onClick}>
            {name} {children}
        </TagStyle>
    );
};

Tag.propTypes = {
    name: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.any,
    children: ChildrenProp
};

export default Tag;

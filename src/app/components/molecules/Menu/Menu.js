/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';
// UI IMPORTS

// STYLE IMPORTS
const MenuStyle = styled.ul`
  display: block;
  width: 100%;
  margin: 0; padding: 0;
  list-style: none;
`;


const Menu = (props: Object) => {
    const { children, className, ...rest } = props;
    return (
        <MenuStyle className={`Menu ${className}`} {...rest}>
            {children}
        </MenuStyle>
    );
};

Menu.propTypes = {
    children: ChildrenProp,
    className: PropTypes.string
};

export default Menu;

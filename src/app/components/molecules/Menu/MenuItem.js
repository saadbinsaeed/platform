/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Icon from 'app/components/atoms/Icon/Icon';
import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';
import RoundedIndicator from 'app/components/atoms/RoundedIndicator/RoundedIndicator';
import { ChildrenProp } from 'app/utils/propTypes/common';
// UI IMPORTS

// STYLE IMPORTS
const MenuItemStyle = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 1rem 0;
  cursor: pointer;
  flex: 1;
  position: relative;
  margin: 0;
  list-style: none;
  /*padding: .6rem 1rem; */
  i {
    line-height: 0;
  }
  a {
    color: #fff;
  }
  &.active {
    color: ${({ theme }) => theme.color.primary};
    background: ${({ theme }) => theme.menu.hover.background};
  }
  & .Menu {
    position: absolute;
    display: none;
    background: white;
    border: solid 1px ${({ theme }) => theme.base.borderColor};
    top: 0;
    z-index: 10;
  }
  &:hover {
     background: ${({ theme }) => theme.menu.hover.background};
    .Menu {
        display: block;
    }
  }
`;

const MenuItemStyleWithLink = styled(MenuItemStyle)`
    padding: 0;
`;

const MenuItemText = styled.div`
    flex: 1;
    display: flex !important;
    align-items: center;
    cursor: pointer;
    padding-left: 1rem;
    padding-right: 1rem;
`;

const MenuCount = styled(RoundedIndicator)`
    width: 1.5rem;
    height: 1rem;
    font-size: .7rem;
    margin-left: .5rem;
`;

const IconWrap = styled.div`
    padding: 0 0 0 1rem;
    display: flex;
    align-items: center;
`;

const StyledHeaderActions = styled(HeaderActions)`
    padding: 1rem;
`;
const StyledLink = styled(Link)`
    width: 100%;
    text-decoration: none;
    padding: 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
`;

const MenuItem = (props: Object) => {
    const { children, name, icon, iconColor, iconSize, iconType, count, actions, to, isModal, className, ...rest } = props;
    if (!to) {
        return (
            <MenuItemStyle className={className} to={to} {...rest}>
                {icon && <IconWrap><Icon name={icon} color={iconColor} type={iconType} size={iconSize} /></IconWrap>}
                <MenuItemText to={to} icon={icon} className={'MenuItemText'}>
                    {name && (<span>{name}</span>)} {children && (<span style={{ width: '100%' }}>{children}</span>)} {count && <MenuCount count={count} />}
                </MenuItemText>
                {actions && <HeaderActions>{actions}</HeaderActions>}
            </MenuItemStyle>);
    }
    let path = {};
    if (typeof (to) === 'object') {
        path = isModal ? { pathname: to.to, state: { ...to.state, modal: isModal } } : to;
    } else {
        path = { pathname: to };
    }
    return (
        <MenuItemStyleWithLink className={className} to={path} {...rest}>
            <StyledLink to={path.pathname}>
                {icon && <IconWrap><Icon name={icon} color={iconColor} type={iconType} size={iconSize} /></IconWrap>}
                <MenuItemText to={to} icon={icon} className={'MenuItemText'}>
                    {name && (<span>{name}</span>)}
                    {children && (<span style={{ width: '100%' }}>{children}</span>)}
                    {count && <MenuCount count={count} />}
                </MenuItemText>
            </StyledLink>
            {actions && <StyledHeaderActions>{actions}</StyledHeaderActions>}
        </MenuItemStyleWithLink>
    );
};

MenuItem.propTypes = {
    name: PropTypes.string,
    count: PropTypes.number,
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    iconSize: PropTypes.string,
    iconType: PropTypes.string,
    className: PropTypes.string,
    to: PropTypes.any,
    isModal: PropTypes.bool,
    activeOnlyWhenExact: PropTypes.bool,
    children: ChildrenProp,
    actions: ChildrenProp,
};

export default MenuItem;

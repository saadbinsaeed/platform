/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Icon from 'app/components/atoms/Icon/Icon';
import IconProps from 'app/components/atoms/Icon/IconProps';
import RoundedIndicator from 'app/components/atoms/RoundedIndicator/RoundedIndicator';

const TextIconContainer = styled.button`
  background: none; border: none 0; outline: none;
  position: relative;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  margin: ${({ margin }) => margin ? '1rem': '0'};
  line-height: 1.1;
  text-decoration: none;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;


const TextIconLabel = styled.div`
  color: #888;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
`;

const TextIconLink = styled(Link)`
  text-decoration: none;
  background: none; border: none 0; outline: none;
  display: inline-block;
`;

const TextIconIndicator = styled(RoundedIndicator)`
  position: absolute;
  right: 0;
  width: 1rem;
  height: 1rem;
  font-size: 0.7rem;
`;

const TextIcon = (props: Object) => {
    const { icon, iconType, color, size, label, count, to, type, form, disabled, margin, ...rest } = props;

    const textIcon = (
        <TextIconContainer margin={margin !== false ? true : false} type={type} form={form} disabled={disabled} {...rest}>
            { count ? <TextIconIndicator count={count} color="warning" /> : null }
            <Icon disabled={disabled} name={icon} type={iconType} color={color} size={size} />
            <TextIconLabel>{label}</TextIconLabel>
        </TextIconContainer>
    );
    return to ? <TextIconLink to={to}>{textIcon}</TextIconLink> : textIcon;
};

TextIcon.propTypes = {
    ...IconProps,
    type: PropTypes.string,
    label: PropTypes.string,
};

export default TextIcon;

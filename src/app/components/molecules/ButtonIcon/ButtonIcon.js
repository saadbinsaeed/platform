/* @flow */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'app/components/atoms/Button/Button';
import Icon from 'app/components/atoms/Icon/Icon';
import Text from 'app/components/atoms/Text/Text';
import { IconTypeProps, SizeProps } from 'app/utils/propTypes/common';

const ButtonIconStyle = styled(Button)`
    font-size: ${({ size, theme }) => theme.iconSize[size]};
    padding: 0.199em 0.35em;
    box-shadow: none;
    ${({ paddind }) => paddind ? 'padding: .1rem;' : ''};
    ${({ fluid }) => fluid ? 'width: 100%;' : ''};
    ${({ rounded }) => rounded ? 'border-radius: 500rem;' : ''};
    ${({ theme, backgroundColor }) => backgroundColor && theme ? `background: ${theme.color[backgroundColor]}; box-shadow: ${theme.shadow.z1}; ` : ''}
    & .Icon {
        margin: 0;
    }
`;

const ButtonIconLabel = styled(Text)`
    margin-left: 1rem;
    font-size: 1rem;
    color: white;
    font-weight: 500;
    text-decoration: none;
    text-align: center;
`;

const ButtonIcon = ({ padding, title, type, icon, size, backgroundColor, iconColor, rounded, onClick, loading, label, buttonType, ...rest }: Object) => {
    return (
        <Fragment>
            <ButtonIconStyle type={buttonType} color={backgroundColor} onClick={loading ? null : onClick} size={size} loading={loading}
                rounded={rounded} title={title} {...rest}>
                <Icon type={type} name={icon} color={iconColor} size={size} />
                {label && (<ButtonIconLabel paddind>{label}</ButtonIconLabel>)}
            </ButtonIconStyle>
        </Fragment>
    );
};

ButtonIcon.propTypes = {
    title: PropTypes.string,
    type: IconTypeProps,
    icon: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    backgroundColor: PropTypes.string,
    iconColor: PropTypes.string,
    size: SizeProps,
    loading: PropTypes.bool,
    rounded: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.any,
    buttonType: PropTypes.string,
};
ButtonIcon.defaultProps = {
    rounded: true,
    buttonType: 'button',

};

export default ButtonIcon;

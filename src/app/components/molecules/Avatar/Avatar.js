/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import memoize from 'memoize-one';

import { SizeProps } from 'app/utils/propTypes/common';
import affectliSso from 'app/auth/affectliSso';
import { createInitials, generateColor } from 'app/utils/avatar/avatar';
import Icon from 'app/components/atoms/Icon/Icon';

const CommonStyles = css`
    display: flex;
    align-items: center;
    justify-content: center;
    ${({ fluid }) => (fluid ? ' width: 100%; height: auto;' : '')};
    ${({ size, theme }) => (size && theme ? `width: ${theme.sizes[size].image}; height: ${theme.sizes[size].image};` : '')};
    width: ${({ width }) => width || ''};
    height: ${({ height }) => height || ''};
    line-height: ${({ lineHeight }) => lineHeight || '75px'};
    border-radius: ${({ rounded }) => (rounded ? '500rem' : 'none')};
    color: white;
`;

const Wrapper = styled.div`
    line-height: 0;
    min-width: 2rem;
`;

const ImageStyle = styled.img`
    ${CommonStyles};
`;

const IconStyle = styled.div`
    ${CommonStyles};
    overflow: hidden;
    background: ${({ backgroundColor }) => backgroundColor || '#3888C1'};
`;

const InitialsStyle = styled.div`
    ${CommonStyles};
    background: ${({ theme, name }) => generateColor(Object.values(theme.statusColors), name)};
`;

/**
 * Renders the image of an avatar.
 */
export default class Avatar extends PureComponent<Object, Object> {

    static propTypes = {
        size: SizeProps,
        src: PropTypes.string,
        width: PropTypes.string,
        height: PropTypes.string,
        name: PropTypes.string,
        rounded: PropTypes.bool,
        className: PropTypes.string,
        alt: PropTypes.string,
    };

    static defaultProps = {
        rounded: true
    };

    buildAvatar = memoize((src, size, className, onClick, alt, rounded, width, height, name, initials, iconName, iconColor, lineHeight) => {
        if (src) {
            const srcWithAuth = src.startsWith('data:') ? src : `${src}?access_token=${affectliSso.getToken() || ''}`;
            return (
                <ImageStyle src={srcWithAuth} size={size} className={className} onClick={onClick} alt={alt} rounded={rounded} width={width} height={height} />
            );
        }
        if (iconName) {
            return (
                <IconStyle
                    size={size}
                    className={className}
                    onClick={onClick}
                    alt={alt}
                    width={width}
                    height={height}
                    name={name}
                    rounded={rounded}
                    lineHeight={lineHeight}
                    backgroundColor={iconColor}
                >
                    <Icon type="mdi" name={iconName} hexColor="#fff" />
                </IconStyle>
            );
        }
        return (
            <InitialsStyle size={size} className={className} onClick={onClick} alt={alt} width={width} height={height} name={name} rounded={rounded}>
                {initials}
            </InitialsStyle>
        );
    });

    render() {
        const { size, src, className, alt, onClick, name, width, height, rounded, iconName, iconColor, lineHeight } = this.props;
        const initials = createInitials(name);
        return (
            <Wrapper className="avatar">
                {this.buildAvatar(src, size, className, onClick, alt, rounded, width, height, name, initials, iconName, iconColor, lineHeight)}
            </Wrapper>
        );
    };
}

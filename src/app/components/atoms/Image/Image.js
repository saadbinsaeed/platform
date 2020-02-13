/* @flow */

import React from 'react';
import styled from 'styled-components';
import affectliSso from 'app/auth/affectliSso';
import ComponentDefaultImage from 'assets/images/icons/default_user.jpg';
import ImageProps from './ImageProps';

const ImageStyle = styled.img`
    ${( { fluid } ) => fluid ? ' width: 100%; height: auto;' : '' };
    ${( { size, theme } ) => size && theme ? `width: ${theme.sizes[size].image}; height: ${theme.sizes[size].image};` : '' };
    width: ${( { width } ) => width || ''};
    height: ${( { height } ) => height || ''};
    border-radius: ${({ rounded }) => rounded ? '500rem' : 'none' };
`;

const Image = (props: Object) => {

    const { src, fluid, size, width, height, alt, rounded, className, ...rest } = props;
    const srcWithAuth = (src && (src.startsWith('data:') ? src : `${src}?access_token=${affectliSso.getToken() || ''}`)) || ComponentDefaultImage;
    return (
        <ImageStyle
            rounded={rounded}
            fluid={fluid}
            width={width}
            height={height}
            src={srcWithAuth}
            role="presentation"
            size={size}
            alt={alt}
            className={className}
            {...rest}
        />
    );
};

Image.propTypes = {
    ...ImageProps
};

Image.defaultProps = {
    src: ComponentDefaultImage,
};

export default Image;

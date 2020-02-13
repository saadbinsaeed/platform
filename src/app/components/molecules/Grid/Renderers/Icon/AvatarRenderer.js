/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { pure } from 'recompose';

import Avatar from 'app/components/molecules/Avatar/Avatar';
import { get } from 'app/utils/lo/lo';
import { cut } from 'app/utils/string/string-utils';

const AvatarContainer = styled.div`
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
`;

const CustomLink = styled(Link)`
    margin-left: 10px;
    &:first-child {
        margin-left: 0;
    }
`;

/**
 * Renders a entity Icon and it's name.
 */
const AvatarRenderer = ({ data, value, idProperty, imageProperty, linkGenerator, nameProperty, showAvatar = true }: Object ) => {
    if (!data || !value || !linkGenerator) {
        return null;
    }
    const id = get(data, idProperty || 'id');
    const name = get(data, nameProperty || 'name');
    const image = get(data, imageProperty || 'image');
    const displayName = cut(value, 25, true);

    return (
        <AvatarContainer>
            {showAvatar && <Avatar size="lg" src={image} name={name} />}
            {id ? <CustomLink to={linkGenerator(id)} title={value}>{displayName}</CustomLink> : displayName}
        </AvatarContainer>
    );
};

AvatarRenderer.propTypes = {
    value: PropTypes.any,
    linkGenerator: PropTypes.func.isRequired,
    data: PropTypes.object,
    idProperty: PropTypes.string,
    imageProperty: PropTypes.string,
};

export default pure(AvatarRenderer);

/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ImageProps from 'app/components/atoms/Image/ImageProps';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import Popover from 'app/components/molecules/Popover/Popover';
import UserAvatarContent from 'app/components/molecules/UserAvatarContent/UserAvatarContent';
import UserStatus from 'app/components/molecules/UserStatus/UserStatus';
import { PlacementProps, UserStatusProps } from 'app/utils/propTypes/common';

const UserAvatarStyle = styled.div`
    position: relative;
    display: inline-block;
    &:focus {
       box-shadow: 0 0 1px ${( { theme } ) => theme.base.active.borderColor };
    }
`;

const UserAvatar = (props: Object) => {

    const { src, size, alt, fluid, name, width, height, placement, status, className, title } = props;

    return (
        <UserAvatarStyle className={`UserAvatar ${className}`} title={title}>
            <Popover placement={placement} width="260px" content={<UserAvatarContent name={name} image={src} />}>
                <UserStatus status={status} />
                <Avatar src={src} size={size} width={width} height={height} alt={alt} fluid={fluid} />
            </Popover>
        </UserAvatarStyle>
    );
};

UserAvatar.propTypes = {
    ...ImageProps,
    status: UserStatusProps,
    className: PropTypes.string,
    placement: PlacementProps,
};

export default UserAvatar;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Title from 'app/components/atoms/Title/Title';
import PopoverContentProps from 'app/components/molecules/Popover/Container/PopoverContainerProps.js';
import Avatar from 'app/components/molecules/Avatar/Avatar';

const UserAvatarContentStyle = styled.div`
    display: block;
    text-align: center;
`;

const UserAvatarName = styled(Title)`
    padding: 1rem;
`;

const UserAvatarContent = (props) => {

    const { name, image } = props;

    return (
        <UserAvatarContentStyle>
            <Avatar src={image} width="150px" height="150px" />
            <br />
            <UserAvatarName as="h3">{name}</UserAvatarName>
        </UserAvatarContentStyle>
    );
};

UserAvatarContent.propTypes = {
    ...PopoverContentProps,
    name: PropTypes.string,
    image: PropTypes.string
};

export default UserAvatarContent;

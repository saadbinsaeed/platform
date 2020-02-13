import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Icon from 'app/components/atoms/Icon/Icon';
import { UserStatusProps } from 'app/utils/propTypes/common';

const UserStatusIcon = styled(Icon)`
    background: white;
    border-radius: 100%;
    display: inline-block;
    position: absolute;
    right: -3px;
    z-index: 0;
    margin:0;padding:0;line-height:1;
    &:before {
        color: ${({ theme, status, colorIndex }) => palette(status, colorIndex, true) }
    }
`;

const UserStatus = (props) => {
    const { status } = props;

    let statusColor;
    let statusColorIndex;
    let statusIcon;
    switch (status) {
        case 'online':
            statusColor = 'green';
            statusColorIndex = 4;
            statusIcon = 'check-circle';
            break;
        case 'offline':
            statusColor = 'red';
            statusColorIndex = 1;
            statusIcon = 'minus-circle';
            break;
        case 'busy':
            statusColor = 'grey';
            statusColorIndex = 1;
            statusIcon = 'minus-circle';
            break;
        default:
            statusColor = 'grey';
            statusColorIndex = 8;
            statusIcon = 'check-circle';
    }

    return ( status !== 'disabled' && <UserStatusIcon name={statusIcon} size="sm" status={statusColor} colorIndex={statusColorIndex} /> );
};

UserStatus.propTypes = {
    status: UserStatusProps,
};
UserStatus.defaultProps = {
    status: 'disabled'
};

export default UserStatus;

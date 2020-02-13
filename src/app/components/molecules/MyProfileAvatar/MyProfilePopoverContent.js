/* @flow */

import React from 'react';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import affectliSso from 'app/auth/affectliSso';
import { get } from 'app/utils/lo/lo';
import sso from 'app/auth/affectliSso';

const MyProfilePopupContent = (props: Object) => {
    const tokenType = get(sso.getRefreshTokenParsed(), 'typ');
    const content = [
        {
            text: 'Profile',
            icon: 'account',
            isModal: true,
            to: '/profile',
        },
        {
            text: 'Support',
            onClick: () => window.open('https://support.affectli.com'),
            icon: 'help-circle',
            isModal: false,
        },
        {
            text: 'Version 0.79.0',
            icon: 'alert-circle',
            isModal: false,

        },
        {
            text: tokenType === 'Offline' ? 'Logout (offline mode)' : 'Logout',
            onClick: () => affectliSso.logout(),
            icon: 'logout',
            isModal: false,
        }
    ];
    return (
        <div>
            {
                content.map(({ text, icon, onClick, isModal, to }: Object) =>
                    <MenuItem key={text} name={text} to={to} icon={icon} onClick={onClick && onClick} isModal />
                )
            }
        </div>
    );
};

export default MyProfilePopupContent;

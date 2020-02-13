/* @flow */

import React from 'react';
import { onlyUpdateForKeys } from 'recompose';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Icon from 'app/components/atoms/Icon/Icon';
import ListItem from 'app/components/molecules/List/ListItem';
import Card from 'app/components/molecules/Card/Card';

import { formatDate } from 'app/utils/date/date';
import affectliSso from 'app/auth/affectliSso';

const Attachment = styled.div`
display: flex;
justify-content: space-between;
`;
const FileSize = styled.div`
position: relative;
top: 1.5rem;
`;
const AttachmentsLabel = styled.a`
display: inline-block;
width: 7rem;
font-size: 0.9rem;
text-decoration: none;
font-weight: 500;
text-transform: capitalize;
color: ${({ theme }) => theme.base.textColor};
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
`;

const chooseIcon = (type: string) => {
    if (type === 'application/octet-stream') return 'svg';
    if (type === 'application/json') return 'file-document';
    if (type.split('/')[0] === 'image') return 'image';
    if (type.split('/')[0] === 'text') return 'file';
    if (type.split('/')[0] === 'audio') return 'audiobook';
    if (type.split('/')[1] === 'pdf') return 'file-pdf';
    return 'file';
};

const formatBytes = (a, b) => {
    if (0 === a) return '0 Bytes';
    const c = 1024,
        d = b || 2,
        e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        f = Math.floor(Math.log(a) / Math.log(c));
    return `${parseFloat((a / Math.pow(c, f)).toFixed(d))} ${e[f]}`;
};

const AboxAttachmentsCard = onlyUpdateForKeys(['attachments'])(({ attachments }: Object) => {
    const emptyMessage = 'No attachment found on this activity.';
    return (
        <Card
            title="Recent Attachments"
            headerActions={<Link to="attachments"><Icon name="window-maximize" size="sm" /></Link>}
            description={(attachments || []).length ? attachments.slice(0, 10).map(({ id, name, modifiedDate, mimeType, size }) => (
                <Attachment key={id}>
                    <ListItem
                        component={<Icon name={chooseIcon(mimeType)} />}
                        title={
                            <div title={`${name} Modified on ${formatDate(modifiedDate)}`}>
                                <AttachmentsLabel target="_blank" download href={`/graphql/file/${id}/download?token=${affectliSso.getToken()}`}>
                                    {name}
                                </AttachmentsLabel>
                            </div>
                        }
                    />
                    <FileSize>{formatBytes(size)}</FileSize>
                </Attachment>
            )) : emptyMessage}
        />
    );
});

export default AboxAttachmentsCard;

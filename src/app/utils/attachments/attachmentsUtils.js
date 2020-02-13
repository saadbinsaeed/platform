// @flow
import React from 'react';
import PropTypes from 'prop-types';
import affectliSso from 'app/auth/affectliSso';
import styled from 'styled-components';

export const formatBytes = (a: number, b: number = 2) => {
    if (0 === Number(a)) return '0 Bytes';
    const c = 1024,
        d = b,
        e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        f = Math.floor(Math.log(a) / Math.log(c));
    return `${parseFloat((a / Math.pow(c, f)).toFixed(d))} ${e[f]}`;
};

export const chooseIcon = (type: string = '') => {
    if (type === 'application/octet-stream') return 'svg';
    if (type === 'application/json') return 'file-document';
    if (type.split('/')[0] === 'image') return 'image';
    if (type.split('/')[0] === 'text') return 'file';
    if (type.split('/')[0] === 'audio') return 'audiobook';
    if (type.split('/')[1] === 'pdf') return 'file-pdf';
    return 'file';
};

export const getExtension = (mimeType: string) => {
    const type = mimeType && mimeType.split('/')[1];
    return type && type.toUpperCase();
};

export const isInvalidExtension = (file: File) => {
    const splited = file.name.split('.');
    if (splited.length > 1) {
        const ext = splited[splited.length - 1].toUpperCase();
        const invalidExt = [
            'ADE',
            'ADP',
            'BAT',
            'CHM',
            'CMD',
            'COM',
            'CPL',
            'EXE',
            'HTA',
            'INS',
            'ISP',
            'JAR',
            'JS',
            'JSE',
            'LIB',
            'LNK',
            'MDE',
            'MSC',
            'MSI',
            'MSP',
            'MST',
            'NSH',
            'PIF',
            'SCR',
            'SCT',
            'SHB',
            'SYS',
            'VB',
            'VBE',
            'VBS',
            'VXD',
            'WSC',
            'WSF',
            'WSH',
        ];
        return invalidExt.includes(ext);
    }
    return true;

};

export const isInvalidSize = (file: File) => {
    return file.size > 52428800;
};

const Link = styled.a`
    text-decoration: none;
`;

export const AttachmentLink = (props: Object) => (
    <Link onClick={props.onClick} target="_blank" download href={`/graphql/file/${props.id}/download?token=${affectliSso.getToken()}`}>
        {props.children}
    </Link>
);

AttachmentLink.propTypes = {
    id: PropTypes.number.isRequired
};

/* @flow */

// $FlowFixMe
import React, { useMemo } from 'react';
import styled, { injectGlobal } from 'styled-components';
import { lighten } from 'polished';

import Icon from 'app/components/atoms/Icon/Icon';
import Editor from 'app/components/atoms/Editor/Editor';
import Flex from 'app/components/atoms/Flex/Flex';
import UploadButton from 'app/components/molecules/UploadButton/UploadButton';
import Tooltip from 'app/components/atoms/Tooltip/Tooltip';

const MessengerFooterStyle = styled.footer`
    grid-area: chatFoot;
    position: relative;
    background: #31343d;
    .ql-toolbar.ql-snow{
        border-color: ${({ theme }) => theme.color.gray }37;
    }
    & .ui-editor-content{
        color: ${({ theme }) => theme.color.white} !important;
        border-color: ${({ theme }) => theme.color.gray }37 !important;
    }
    & .ql-formats .ql-stroke {
        stroke: #b2b2b2;
    }
    & .ql-formats .ql-fill {
        fill: #b2b2b2;
    }
    & .ui-editor-content [data-mode="link"] {
        background-color: #31343d;
        color: white;
        font-size: 18px;
    }
    & .ui-editor-content a {
        color: white !important;
    }
    & .ui-editor-content [data-mode="link"] input {
        background-color: #31343d;
        color: white;
        font-size: 18px;
        border-color: #4f5361;
    }
    & .ui-editor-content [data-mode="link"] {
        border: 0;
        box-shadow: 0px 0px 2px #ddd;
    }
    & .ql-snow.ql-toolbar button.ql-active,
    & .ql-snow.ql-toolbar button:active,
    & .ql-snow.ql-toolbar button:focus,
    & .ql-snow.ql-toolbar button:hover {
        color: white;
    }
    & .ql-snow.ql-toolbar button:active .ql-stroke,
    & .ql-snow.ql-toolbar button:focus .ql-stroke,
    & .ql-snow.ql-toolbar button:hover .ql-stroke,
    & .ql-snow.ql-toolbar button.ql-active .ql-stroke {
        stroke: white;
    }
    & .ql-snow.ql-toolbar button:active .ql-fill,
    & .ql-snow.ql-toolbar button:focus .ql-fill,
    & .ql-snow.ql-toolbar button.ql-active,
    & .ql-snow.ql-toolbar button.ql-active .ql-fill,
    & .ql-snow.ql-toolbar button:hover .ql-fill {
        fill: white;
    }
`;

const SendButton = styled.div`
    position: absolute;
    border-radius: 50%;
    padding: 0.5rem;
    width: 50px;
    height: 50px;
    right: 10px;
    top: 65px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #58b1d3;
    z-index: 10;
    &:hover {
        background: ${({ theme }) => lighten(0.1, theme.color.secondary)};
    }
`;
// eslint-disable-next-line no-unused-expressions
injectGlobal`
    .ql-editor {
        width: calc(100% - 60px);
        word-break: break-word;
    }
`;

const EditorHeader = ({ attachMessengerFile }: Object) =>  (
    <Tooltip>
        <Flex spaceBetween>
            <span className="ql-formats">
                <button alt="Bold" className="ql-bold" aria-label="Bold"></button>
                <button alt="Italic" className="ql-italic" aria-label="Italic"></button>
                <button alt="Underline" className="ql-underline" aria-label="Underline"></button>
                <button alt="Strike-through" className="ql-strike" aria-label="Strike"></button>
                <button alt="Numbered List" className="ql-list" value="ordered" aria-label="Ordered list"></button>
                <button alt="Bullet List" className="ql-list" value="bullet" aria-label="Bullet list"></button>
                <button alt="Link" className="ql-link" aria-label="Insert Link"></button>
            </span>
            <Tooltip x={-83}>
                <UploadButton multiple alt="Upload Attachment" margin={false} icon="upload" color="white" onSelect={attachMessengerFile}/>
            </Tooltip>
        </Flex>
    </Tooltip>
);

const filters = ['backgroundColor', 'background', 'color'];
const MessengerFooter = ({ messageText, onChange, onSend, attachMessengerFile }: Object) => {
    const editorHeader = useMemo(() => <EditorHeader attachMessengerFile={attachMessengerFile} />, [attachMessengerFile]);
    return (
        <MessengerFooterStyle>
            <SendButton onClick={onSend}>
                <Icon name="send" color="white" />
            </SendButton>
            <Editor
                value={messageText}
                onTextChange={onChange}
                filters={filters}
                headerTemplate={editorHeader}
            />
        </MessengerFooterStyle>
    );};

export default MessengerFooter;

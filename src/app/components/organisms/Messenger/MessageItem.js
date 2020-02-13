// @flow
// $FlowFixMe
import React, { memo } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import Tooltip from 'app/components/atoms/Tooltip/Tooltip';
import Icon from 'app/components/atoms/Icon/Icon';
import { getStr } from 'app/utils/utils';
import { AttachmentLink, chooseIcon, getExtension, formatBytes } from 'app/utils/attachments/attachmentsUtils';
import ListItem from 'app/components/molecules/List/ListItem';
import Flex from 'app/components/atoms/Flex/Flex';

const ListItemStyled = styled(ListItem)`
    margin: 0 auto;
    padding: 0;
    background: ${({ isSelfMessage, theme }) => isSelfMessage ? '#2762a5' : '#282b32'};
    border-radius: 6px;
`;

const MessageItemStyle = styled.div`
    display: flex;
    ${({ isSelfMessage }) => isSelfMessage ? 'float: right; margin: 0.3rem' : 'float: left; margin: 0.3rem 0.3rem 0.3rem 0rem'};
    clear: both;
    max-width: 95%;
`;

const MessageContent = styled.div`
    font-size: .9em;
    display: block;
    word-break: break-word;
    color: white;
    p { margin: 0; }
    max-width: 100%;
`;

const MessageText = styled.div`
    background: ${({ isSelfMessage, theme }) => isSelfMessage ? '#2762a5' : '#282b32'};
    border-radius: 6px;
    ${({ padding }) => padding && `padding: ${padding};`}
`;

const AvatarWrap = styled(Tooltip)`
    margin: 0 .5rem;
`;

const MessageDate = styled.p`
    font-size: .7rem;
    opacity: .5;
    text-align:  ${({ isSelfMessage, theme }) => isSelfMessage ? 'right' : 'left'};
    margin: 0;
    padding: .1rem .5rem;
`;

const AttachmentImage = styled.img`
    max-width: 100%;
`;

const AttachmentText = styled.span`
    ${({ deleted }) => deleted ? 'text-decoration: line-through;' : ''}
`;

const AttachmentIcon = memo((props: Object) => {
    const { mimeType, id, deleted } = props.message;
    const iconName = chooseIcon(mimeType);
    return (
        deleted
            ? <Icon name={iconName} size="lg" />
            : (
                <AttachmentLink id={id}>
                    <Icon name={iconName} size="lg" />
                </AttachmentLink>
            )
    );
});

const MessageItem = ({ isSelfMessage, message, name, avatar, date }: Object) => {
    let messageBody = (
        <MessageText isSelfMessage={isSelfMessage} padding=".4rem .5rem">
            <div dangerouslySetInnerHTML={{__html: `${getStr(message, 'message') || ''}`}} />
        </MessageText>

    );
    const { type, id, name: filename, mimeType, size, deleted } = message;
    if (type === 'attachment') {
        messageBody = !deleted && (mimeType || '').startsWith('image')
            ? (
                <MessageText isSelfMessage={isSelfMessage} padding=".4rem .5rem">
                    <AttachmentImage alt={filename} src={`/graphql/file/${id}`} />
                    <AttachmentLink id={id}>
                        <Flex spaceBetween>
                            <span>
                                {filename}
                                <br />
                                <small>{getExtension(mimeType)} - {formatBytes(size)}</small>
                            </span>
                            <Icon name="download" />
                        </Flex>
                    </AttachmentLink>
                </MessageText>

            )
            : (
                <ListItemStyled
                    isSelfMessage={isSelfMessage}
                    component={<AttachmentIcon message={message} />}
                    title={
                        deleted
                            ? <AttachmentText deleted={deleted}>{filename}</AttachmentText>
                            : <AttachmentLink id={id}>{filename}</AttachmentLink>
                    }
                    subTitle={<AttachmentText deleted={deleted}>{getExtension(mimeType)} - {formatBytes(size)}</AttachmentText>}
                    raised
                    rowWrap
                />
            );
    }

    return (
        <MessageItemStyle isSelfMessage={isSelfMessage}>
            {!isSelfMessage && <AvatarWrap alt={name} x={10} y={-50}>
                <span alt={name}><Avatar src={avatar} name={name} size="lg" /></span>
            </AvatarWrap>}
            <MessageContent>
                {messageBody}
                <MessageDate isSelfMessage={isSelfMessage}>{moment(date).format('DD.MM HH:mm')}</MessageDate>
            </MessageContent>
        </MessageItemStyle>
    );

};

export default MessageItem;

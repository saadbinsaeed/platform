/* @flow */

import React from 'react';
import { onlyUpdateForKeys } from 'recompose';
import styled from 'styled-components';

import Icon from 'app/components/atoms/Icon/Icon';
import Card from 'app/components/molecules/Card/Card';
import Flex from 'app/components/atoms/Flex/Flex';
import MessageItem from 'app/components/organisms/Messenger/MessageItem';
import { get } from 'app/utils/lo/lo';

const FlexColumn = styled(Flex)`
    flex-direction: column;
    overflow: hidden;
`;

/**
  *
**/
const AboxCommentsCard = onlyUpdateForKeys(['comments'])(({ comments, loadMessenger, profileId }: Object) => {
    const emptyMessage = 'No comment found on this activity.';
    return (
        <Card
            title="Recent Comments"
            headerActions={<Icon type="af" name="messenger" size="sm" onClick={loadMessenger} />}
            description={(
                <FlexColumn alignItems="flex-start">
                    {(comments || []).length ? (comments || []).slice(0, 10).map(({ createDate, message, createdBy }, index) => (
                        <MessageItem key={index} name={get(createdBy, 'name')} avatar={get(createdBy, 'image')} message={message} date={createDate} isSelfMessage={profileId === get(createdBy, 'id')} />
                    )): emptyMessage}
                </FlexColumn>

            )}
        />
    );
});

export default AboxCommentsCard;

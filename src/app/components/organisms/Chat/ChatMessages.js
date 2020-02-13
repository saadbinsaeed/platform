import React, { PureComponent } from 'react';
import styled from 'styled-components';

import ChatMessage from './ChatMessage';

const ChatMessagesStyle = styled.div`
`;

/**
 * Chat Component
 */
class ChatMessages extends PureComponent<Object> {
    /**
     * Render our chat container
     */
    render() {
        return (
            <ChatMessagesStyle>
                <ChatMessage />
            </ChatMessagesStyle>
        );
    }
}

export default ChatMessages;

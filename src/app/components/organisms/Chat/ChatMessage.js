import React, { PureComponent } from 'react';
import styled from 'styled-components';
import ChatMessageBox from './ChatMessageBox';

const ChatMessageStyle = styled.div`
   display: flex;
   align-items: center;
`;

/**
 * Chat Component
 */
class ChatMessage extends PureComponent<Object> {
    /**
     * Render our chat container
     */
    render() {
        return (
            <ChatMessageStyle>
                <ChatMessageBox />
            </ChatMessageStyle>
        );
    }
}

export default ChatMessage;

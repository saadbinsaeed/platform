import React, { PureComponent } from 'react';
import styled from 'styled-components';

const ChatMessageBoxStyle = styled.div`
`;

/**
 * Chat Component
 */
class ChatMessageBox extends PureComponent<Object> {
    /**
     * Render our chat container
     */
    render() {
        return (
            <ChatMessageBoxStyle>
                <p>
                    Lorem ipsum dolor sit amet,
                    consectetur adipisicing elit.
                    Aliquam culpa, ea ipsa magni maiores
                    modi omnis pariatur quibusdam sequi sunt suscipit unde veritatis,
                    voluptatibus? Ab culpa deleniti natus velit voluptates?
                </p>
            </ChatMessageBoxStyle>
        );
    }
}

export default ChatMessageBox;

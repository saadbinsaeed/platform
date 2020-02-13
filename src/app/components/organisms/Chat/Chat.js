import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';


const ChatStyle = styled.div`
   
`;

/**
 * Chat Component
 */
class Chat extends PureComponent<Object> {
    /**
     * Render our chat container
     */
    render() {
        return (
            <ChatStyle>
                Chat
            </ChatStyle>
        );
    }
}

export default Chat;

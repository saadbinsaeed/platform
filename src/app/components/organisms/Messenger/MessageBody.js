import styled from 'styled-components';

const MessengerBody = styled.div`
  grid-area: chatBody;
  background: #31343d;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #2a2f38;
  }
  &::-webkit-scrollbar {
      width: 8px;
      background-color: #31343d;
  }
  &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #cfd3dc;
  }

`;

export default MessengerBody;

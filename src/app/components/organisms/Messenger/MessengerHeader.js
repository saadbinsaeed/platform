/* @flow */

import React from 'react';
import styled from 'styled-components';
import { isBrowser } from 'react-device-detect';

import Title from 'app/components/atoms/Title/Title';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Tooltip from 'app/components/atoms/Tooltip/Tooltip';

const HeaderWrapper = styled.header`
    grid-area: chatHead;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: #31343d;
    color: ${({ theme }) => theme.color.white};
    box-shadow: ${({ theme }) => theme.shadow.z1};
    z-index: 1;
`;

const Left = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto auto 1fr;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem
`;

const TitleWrapper = styled.div`
  overflow: hidden;
`;

// eslint-disable-next-line max-len
const MessengerHeader = ({ fullScreen, toggleFullscreen, openTeamMembers, goToSummary, goToAttachments, title, subTitle, onClose, toggleSidebar }: { fullScreen: Object, toggleFullscreen: Function, goToSummary: Function, goToAttachments: Function, openTeamMembers: Function , title: any, subTitle: string, onClose: Function, toggleSidebar: Function }) => (
    <HeaderWrapper>
        <Left>
            <TitleWrapper>
                <Title as="h2">{title}</Title>
                <Title as="h4">{subTitle}</Title>
            </TitleWrapper>
        </Left>
        <Tooltip x={-30} y={-200}>
            <Right>
                <ButtonIcon alt="Go to Task/Process" icon="login-variant" iconColor="white" onClick={goToSummary} />
                {isBrowser && <ButtonIcon alt={fullScreen ? 'Collapse Messenger' : 'Expand Messenger'} icon={fullScreen ? 'arrow-collapse' : 'open-in-new'} iconColor="white" onClick={toggleFullscreen} />}
                <ButtonIcon alt="See Team" icon="account-multiple" iconColor="white" onClick={openTeamMembers} />
                <Tooltip x={-30} y={-150}>
                    <ButtonIcon alt="See Attachments" icon="paperclip" iconColor="white" onClick={goToAttachments} />
                </Tooltip>
                <ButtonIcon alt="Close" icon="close" iconColor="white" onClick={onClose} />
            </Right>
        </Tooltip>
    </HeaderWrapper>
);

export default MessengerHeader;

// @flow
import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { lighten } from 'polished';
import memoize from 'memoize-one';
import { deepEquals } from 'app/utils/utils';
import Icon from 'app/components/atoms/Icon/Icon';
import { getCustomAction, isNewWindowNeeded } from 'app/utils/notification/notificationUtils';

// $FlowFixMe
import audioSrc from 'media/sounds/notification.mp3';

// $FlowFixMe
const audio = new Audio(audioSrc);

const ScrollBarStyle = css`
    &::-webkit-scrollbar
    {
      width: 0px !important;
      height: 0px !important;
    }
`;

const BarDefaults = css`
    background: tomato;
    font-size: 12px;
    color: white;
    display: flex;
    align-items: center;
    overflow: hidden;
    transition: background 0.3s ease-in-out;
    &:hover {
        background: ${lighten(0.03, 'tomato')};
    }
`;

const NotificationsComponent = styled.div`
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 70%;
    @media (min-width: 240px) {
        width: 80%;
    }
    margin: 0 auto;
    z-index: 9999;
`;

const NotificationBar = styled.div`
    ${BarDefaults};
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
`;

const NotificationIcon = styled(Icon)`
    padding: 0.5rem;
`;

const IconsWrapper = styled.div`
    margin-left: auto;
`;

const NotificationText = styled.div`
    padding: 0.5rem 0.5rem 0.5rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const NotificationToggler = styled(NotificationIcon)`
    transition: 0.5s ease-in-out;
    ${({ isOpen }) => (isOpen ? 'transform: rotate(180deg);' : 'transform: rotate(0deg);')};
`;

const NotificationListIcon = styled(NotificationIcon)`
    padding: 0.5rem;
    margin-left: auto;
`;

const NotificationsWrapper = styled.div`
    position: relative;
`;

const NotificationsListContainer = styled.div`
    ${ScrollBarStyle};
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    max-height: calc(100vh - 52px);
    overflow: auto;
    z-index: 99;
    display: none;
    ${({ isOpen }) => (isOpen ? 'display:block' : 'display:none')};
`;

const NotificationListItem = styled.div`
    ${BarDefaults};
`;

/**
 *
 */
class NotificationsBar extends PureComponent<Object, Object> {
    static propTypes = {
        messages: PropTypes.array,
        notificationRead: PropTypes.func
    };

    state = { isNotificationsOpen: false };

    /**
     * Toggle the visibility of the NotificationsList
     */
    toggleNotificationsList = () => this.setState({ isNotificationsOpen: !this.state.isNotificationsOpen });

    componentDidMount() {
        this.props.messages > 0 && this.playAudio();
    }

    /**
     * We want to play audio if the messages props change
     * @param prevProps
     */
    componentDidUpdate(prevProps: Object) {
        if (!deepEquals(this.props.messages.map(({ id }) => id), prevProps.messages.map(({ id }) => id))) {
            this.playAudio();
        }
    }

    /**
     * If the item is the list has been checked off. Mark as "Read".
     */
    markAsRead = (event: Object, id: String) => {
        event.stopPropagation();
        this.props.notificationRead && this.props.notificationRead(id);
    };

    playAudio = () => {
        audio.currentTime = 0;
        audio.play().catch((error) => {
            if (error.code !== 0) {
                throw error;
            }
        });
    };

    /**
     * If there's only 1 message, we should just show the single item.
     * If there's more than one, show a count and an expand to see all.
     */
    buildNotificationHeaderBar = memoize((messages) => {
        if (messages && messages.length > 1) {
            return (
                <NotificationBar>
                    <NotificationIcon name="radio-tower" />
                    <NotificationText>{messages.length} Broadcast messages</NotificationText>
                    <IconsWrapper>
                        <NotificationToggler name="arrow-down" onClick={this.toggleNotificationsList} isOpen={this.state.isNotificationsOpen} />
                    </IconsWrapper>
                </NotificationBar>
            );
        }
        if (messages && messages.length === 1) {
            return (
                <NotificationBar onClick={this.handleBroadcastNavigation(messages[0])}>
                    <NotificationIcon name="radio-tower" />
                    <NotificationText>{messages[0].text}</NotificationText>
                    <IconsWrapper>
                        <NotificationListIcon name="check" onClick={event => this.markAsRead(event, messages[0].id)} />
                    </IconsWrapper>
                </NotificationBar>
            );
        }
        return null;
    });

    handleBroadcastNavigation = ({ actionData, actionType }: Object) => () => {
        const url = getCustomAction(actionData, actionType);
        const isNewWindow = isNewWindowNeeded(actionType);
        if (url) {
            this.toggleNotificationsList();
            if (isNewWindow) {
                window.open(url);
            } else {
                window.open(url, '_self');
            }
        }
    };
    /**
     * Create a list of our Notifications
     */
    buildNotificationsList = memoize(
        messages =>
            messages &&
            messages.map((message, index) => {
                return (
                    <NotificationListItem
                        key={message.id}
                        isOpen={this.state.isNotificationsOpen}
                        className={setTimeout(() => 'visible', index * 100)}
                        index={index}
                        onClick={this.handleBroadcastNavigation(message)}
                    >
                        <NotificationIcon name="radio-tower" />
                        <NotificationText>{message.text}</NotificationText>
                        <NotificationListIcon name="check" onClick={event => this.markAsRead(event, message.id)} />
                    </NotificationListItem>
                );
            })
    );

    /**
     * Generate layout based on messages
     */
    render() {
        const messages = this.props.messages;
        return (
            messages && (
                <NotificationsComponent>
                    {this.buildNotificationHeaderBar(messages)}
                    {messages.length > 1 && (
                        <Fragment>
                            <NotificationsWrapper>
                                <NotificationsListContainer isOpen={this.state.isNotificationsOpen}>
                                    {this.buildNotificationsList(messages)}
                                </NotificationsListContainer>
                            </NotificationsWrapper>
                        </Fragment>
                    )}
                </NotificationsComponent>
            )
        );
    }
}

export default NotificationsBar;

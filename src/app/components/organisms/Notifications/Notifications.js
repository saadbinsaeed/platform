import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import List from '../../molecules/List/List';
import ListItem from '../../molecules/List/ListItem';
import UserAvatar from '../../molecules/UserAvatar/UserAvatar';

const NotificationStyle = styled.div`
    
`;

/**
 * Chat Component
 */
class Notifications extends PureComponent<Object> {
    /**
     * Render our chat container
     */
    render() {
        return (
            <NotificationStyle>
                <List>
                    <ListItem component={<UserAvatar src="/temp/img/user.jpg" size="md" />} title="Completed Task" subTitle="Ian, 2 Hours ago" />
                    <ListItem component={<UserAvatar src="/temp/img/user.jpg" size="md" />} title="Started a conversation" subTitle="Glen, 2 Hours ago" />
                    <ListItem component={<UserAvatar src="/temp/img/user.jpg" size="md" />} title="Added you to a task" subTitle="Katie, 2 Hours ago" />
                    <ListItem component={<UserAvatar src="/temp/img/user.jpg" size="md" />} title="Mentioned you" subTitle="2 Hours ago" />
                    <ListItem component={<UserAvatar src="/temp/img/user.jpg" size="md" />} title="Did something" subTitle="2 Hours ago" />
                    <ListItem component={<UserAvatar src="/temp/img/user.jpg" size="md" />} title="Did something else" subTitle="2 Hours ago" />
                </List>
            </NotificationStyle>
        );
    }
}

export default Notifications;

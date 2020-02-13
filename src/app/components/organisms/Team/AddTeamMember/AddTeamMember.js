import React, { PureComponent } from 'react';
// import styled from 'styled-components';
import ActionBar from 'app/components/molecules/ActionBar/ActionBar';
import Input from 'app/components/atoms/Input/Input';
import List from 'app/components/molecules/List/List';
import ListItem from 'app/components/molecules/List/ListItem';
import UserAvatar from 'app/components/molecules/UserAvatar/UserAvatar';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import ListGroup from 'app/components/molecules/List/ListGroup';

/**
 * Fields required to add a team member.
 * This can then be used on a page or inside a modal.
 */
class AddTeamMember extends PureComponent<Object> {
    /**
     * Render our add team member form
     */
    render() {
        return (
            <div>
                <ActionBar left={<Input name="searchPeople" placeholder="Search people..." />} />
                <ListGroup name="Select team members from the list" />
                <List>
                    <ListItem
                        component={<UserAvatar src="https://lh3.googleusercontent.com/-HwObQVjQxpo/AAAAAAAAAAI/AAAAAAAAAAA/APJypA2-qVxWS0vplj3XvBhXvgLbYToe4A/s96-c-mo/photo.jpg" size="lg" status="busy" name="Glen Scott" />}
                        title="Glen Scott"
                        subTitle="CEO"
                        actions={<ButtonIcon icon="plus" />}
                    />
                    <ListItem
                        component={<UserAvatar src="https://lh3.googleusercontent.com/-HwObQVjQxpo/AAAAAAAAAAI/AAAAAAAAAAA/APJypA2-qVxWS0vplj3XvBhXvgLbYToe4A/s96-c-mo/photo.jpg" size="lg" status="online" name="Ian Jamieson" />}
                        title="Ian Jamieson"
                        subTitle="Front-end UI/Dev"
                        actions={<ButtonIcon icon="plus" />}
                    />
                    <ListItem
                        component={<UserAvatar src="https://lh3.googleusercontent.com/-HwObQVjQxpo/AAAAAAAAAAI/AAAAAAAAAAA/APJypA2-qVxWS0vplj3XvBhXvgLbYToe4A/s96-c-mo/photo.jpg" size="lg" status="offline" name="Katie BadHorse" />}
                        title="Katie BadHorse"
                        subTitle="Designer"
                        actions={<ButtonIcon icon="plus" />}
                    />
                    <ListItem
                        component={<UserAvatar src="https://lh3.googleusercontent.com/-HwObQVjQxpo/AAAAAAAAAAI/AAAAAAAAAAA/APJypA2-qVxWS0vplj3XvBhXvgLbYToe4A/s96-c-mo/photo.jpg" size="lg" name="Betty DerpyDoop" />}
                        title="Betty DerpyDoop"
                        subTitle="Janitor"
                        actions={<ButtonIcon icon="plus" />}
                    />
                </List>
            </div>
        );
    }
}

export default AddTeamMember;

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

import List from 'app/components/molecules/List/List';
import ListItem from 'app/components/molecules/List/ListItem';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import UserAvatar from 'app/components/molecules/UserAvatar/UserAvatar';
// import ListGroup from 'app/components/molecules/List/ListGroup';
/**
 * Component that displays a list of team members related to a process or task
 */
class PeopleList extends PureComponent<Object> {
    /**
     * Render our team member list using data props passed in
     * @returns {XML}
     */
    render() {
        return (
            <div>
                <List>
                    <ListItem
                        component={<UserAvatar src="/temp/img/user.jpg" size="lg" status="busy" name="Glen Scott" />}
                        title="Glen Scott"
                        subTitle="CEO"
                        actions={<ButtonIcon icon="plus" />}
                    />
                    <ListItem
                        component={<UserAvatar src="/temp/img/user.jpg" size="lg" status="online" name="Ian Jamieson" />}
                        title="Ian Jamieson"
                        subTitle="Front-end UI/Dev"
                        actions={<ButtonIcon icon="plus" />}
                    />
                    <ListItem
                        component={<UserAvatar src="/temp/img/user.jpg" size="lg" status="offline" name="Katie BadHorse" />}
                        title="Katie BadHorse"
                        subTitle="Designer"
                        actions={<ButtonIcon icon="plus" />}
                    />
                    <ListItem
                        component={<UserAvatar src="/temp/img/user.jpg" size="lg" name="Betty DerpyDoop" />}
                        title="Betty DerpyDoop"
                        subTitle="Janitor"
                        actions={<ButtonIcon icon="plus" />}
                    />
                </List>
            </div>
        );
    }
}

export default PeopleList;

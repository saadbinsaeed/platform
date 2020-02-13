/* @flow */

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import Avatar from 'app/components/molecules/Avatar/Avatar';
import Card from 'app/components/molecules/Card/Card';
import Icon from 'app/components/atoms/Icon/Icon';


const TeamAvatar = styled(Avatar)`
margin-left: 0.5rem;
`;
const TeamMembers = styled.div`
display: flex;
flex-wrap: wrap;
`;
const TeamCount = styled.div`
text-align: center;
width: 3.5rem;
height: 1.5rem;
border-radius: 200rem;
background-color: #f2f2f2;
color: #adadad;
margin-top: 0.25rem;
margin-left: 0.5rem;
cursor: pointer;
`;

/**
 *
 */
class AboxTeamCard extends PureComponent<Object, Object>  {

    static propTypes = {
        teamMembers: PropTypes.array,
    };

    static defaultProps = {
        teamMembers: [],
    };

    buildUserList = memoize(teamMembers => teamMembers
        .filter(member => member && member.user)
        .slice(0, 10)
        .map(({ user, id }) => (
            <TeamAvatar
                key={id}
                title={user && user.name}
                src={(user && user.image)}
                size="lg"
                name={(user && user.name) || 'No Name'}
            />
        )))

    render() {
        const { teamMembers, action } = this.props;
        const len = (teamMembers || []).length;
        const userList = this.buildUserList(teamMembers || []);
        return (
            <Card
                title="Team"
                headerActions={<Icon name="window-maximize" size="sm" onClick={action} />}
                description={!userList.length ?
                    'No Team Members' :
                    <TeamMembers>
                        {userList}
                        {len > 10 && <TeamCount onClick={action}> +{len - 10}</TeamCount>}
                    </TeamMembers>
                }
            />

        );
    }
}

export default AboxTeamCard;

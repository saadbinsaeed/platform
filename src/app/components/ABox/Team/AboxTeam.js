/* @flow */

// $FlowFixMe
import React, { Fragment, PureComponent, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { Button } from '@mic3/platform-ui';
import styled from 'styled-components';
import { darken } from 'polished';
import { TextField } from '@mic3/platform-ui';

import List from 'app/components/molecules/List/List';
import ListItem from 'app/components/molecules/List/ListItem';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import Container from 'app/components/atoms/Container/Container';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import ListGroup from 'app/components/molecules/List/ListGroup';
import Immutable from 'app/utils/immutable/Immutable';
import { get, sortBy } from 'app/utils/lo/lo';
import { getStr } from 'app/utils/utils';
import {
    addTeamMember as addTeamMemberToTask,
    removeTeamMember as removeTeamMemberFromTask
} from 'store/actions/abox/taskActions';
import {
    addTeamMember as addTeamMemberToProcess,
    removeTeamMember as removeTeamMemberFromProcess
} from 'store/actions/abox/processActions';
import AddTeamMemberModal from 'app/containers/AddTeamMemberModal/AddTeamMemberModal';
import ResponsiveActions from 'app/components/molecules/ResponsiveActions/ResponsiveActions';
import Icon from 'app/components/atoms/Icon/Icon';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';

import ItemColumn from 'app/components/molecules/List/ItemColumn';
import ItemRow from 'app/components/molecules/List/ItemRow';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import GroupedAvatar from 'app/components/molecules/Avatar/GroupedAvatar';
import ListItemBase from 'app/components/molecules/List/ListItemBase';
import { useToggle } from 'app/utils/hook/hooks';
import { fromNow } from 'app/utils/date/date';

const ChangesRow = styled(ItemColumn)`
    background: ${({theme}) => darken(0.05, theme.widget.background)};
`;
const SearchField = styled(TextField)`
    padding: 8px 16px !important;
    background: ${({ theme }) => theme.filters.toolbarBackground};
`;

const ListItemExpandable = styled(ListItemBase)`
    word-break: break-all;
    a { color: ${({ theme }) => theme.base.textColor}; }
`;

const AboxTeamGroupItem = ({ group, endDate, type, removeTeamMember, id, createdDate }) => {
    const [open, toggle] = useToggle();
    const users = get(group, 'users') || [];
    const onDelete = useCallback(
        () => removeTeamMember(group || {}, 'groups')
        , [group, removeTeamMember]);

    const usersList = useMemo(() => users
        .filter(user => user.active)
        .map((user, index) => (
            <AboxTeamListItem {...{
                user,
                endDate,
                canRemove: false,
                key: index
            }} />
        )), [endDate, users]);
    return !!group && (
        <ListItemExpandable raised small>
            <ItemRow>
                <ItemColumn shrink>
                    <GroupedAvatar width={40} height={40} people={users} name={group.name} />
                </ItemColumn>
                <ItemColumn grow wrap>
                    <b>{group.name}</b>
                    <div>{group.id}{createdDate ? ` - ${fromNow(createdDate)}` : ''}</div>
                </ItemColumn>
                <ItemColumn>
                    {type === 'participant' && <Icon
                        name="delete"
                        onClick={onDelete}
                    />}
                    <ButtonIcon icon="menu-down" onClick={toggle} />
                </ItemColumn>
            </ItemRow>
            { open && (
                <ChangesRow>
                    {usersList}
                </ChangesRow>
            ) }
        </ListItemExpandable>
    );
};


const AboxTeamListItem = ({ user, endDate, canRemove, removeTeamMember, id, createdDate }: Object) => {
    const onDelete = useCallback(() => removeTeamMember(user, 'users'), [removeTeamMember, user]);
    return (
        <ListItem
            component={<Avatar src={get(user, 'image')} name={get(user, 'name')} size="lg" />}
            title={<PeopleLink id={get(user, 'id')}>{get(user, 'name')}</PeopleLink>}
            subTitle={`@${getStr(user, 'login') || ''}${createdDate ? ` - ${fromNow(createdDate)}` : ''}`}
            actions={
                <Fragment>
                    {
                        !endDate && canRemove && <ResponsiveActions
                            actions={<Icon
                                name="delete"
                                onClick={onDelete}
                            />}
                        />
                    }
                </Fragment>
            }
            raised
        />
    );
};

const isIncludes = (str: string, searchValue: string) => str.toLowerCase().includes(searchValue.toLowerCase());

/**
 * Renders the view to display the classification.
 */
class AboxTeam extends PureComponent<Object, Object> {
    static propTypes = {
        type: PropTypes.string,
        isLoading: PropTypes.bool,
        addTeamMembersTaskLoading: PropTypes.bool,
        addTeamMembersProcessLoading: PropTypes.bool,
        details: PropTypes.object,
        addTeamMember: PropTypes.func,
        reloadDetails: PropTypes.func,
        deleteTeamMember: PropTypes.func,
        onDelete: PropTypes.func,
    };

    listRef = React.createRef();

    /**
     * Set our default state
     */
    constructor(props: Object) {
        super(props);
        this.state = Immutable({
            isAddTeamOpen: false,
            serachValue: '',
        });
    }

    toggleAddUser = () => {
        this.setState({ isAddTeamOpen: !this.state.isAddTeamOpen });
    };

    addTeamMembers = ({ team: members, groups }: Object) => {
        const { details: { id }, type, addTeamMemberToTask, addTeamMemberToProcess } = this.props;
        const addTeamMember = type === 'task' ? addTeamMemberToTask : addTeamMemberToProcess;
        const userPromises = members.map(user => addTeamMember(id, 'users', user.id));
        const groupPromises = groups.map(group => addTeamMember(id, 'groups', group.id));
        Promise.all(userPromises)
            .then(() => Promise.all(groupPromises))
            .then(() => this.props.reloadDetails(id))
            .finally(() => this.setState({ isAddTeamOpen: false }));
    };

    removeTeamMember = (member: Object, family: string) => {
        const { onDelete, details: { id }, type, removeTeamMemberFromTask, removeTeamMemberFromProcess } = this.props;
        const removeTeamMember = type === 'task' ? removeTeamMemberFromTask : removeTeamMemberFromProcess;
        if (!member.id) {
            throw new Error('The team member is not associated to any user.');
        }
        if(onDelete) {
            onDelete(member);
        }
        removeTeamMember(id, family, member.id).then(() => this.props.reloadDetails(id));
    };

    buildList = (members: Array<Object>, endDate: string, canRemove: boolean) => {
        members = sortBy(members, 'user.name', { caseInsensitive: true });
        return (members || []).map((member, index) => !get(member, 'group') ?
            <AboxTeamListItem
                key={index}
                user={get(member, 'user')}
                createdDate={get(member, 'createdDate')}
                id={get(member, 'id')}
                removeTeamMember={this.removeTeamMember}
                endDate={endDate}
                canRemove={canRemove}
            />
            : <AboxTeamGroupItem
                key={index}
                group={get(member, 'group')}
                createdDate={get(member, 'createdDate')}
                type={get(member, 'type')}
                id={get(member, 'id')}
                endDate={endDate}
                removeTeamMember={this.removeTeamMember}
            />
        );
    };

    buildUserFilterBy = memoize((owner: Object, assignee: Object, teamMembers: Array<Object>) => {
        const filterBy = [];
        if (owner) filterBy.push({ field: 'id', op: '<>', value: owner.id });
        if (assignee) filterBy.push({ field: 'id', op: '<>', value: assignee.id });
        if (teamMembers && teamMembers.length) {
            filterBy.push(
                ...teamMembers
                    .filter(member => member && member.user && member.user.id)
                    .map(({ user: { id } }) => ({ field: 'id', op: '<>', value: id }))
            );
        }
        filterBy.push({ field: 'active', op: '=', value: true });
        return filterBy;
    });

    buildGroupFilterBy = memoize((teamMembers: Array<Object>) => {
        const filterBy = [];
        if (teamMembers && teamMembers.length) {
            filterBy.push(
                ...teamMembers
                    .filter(member => member && member.group && member.group.id)
                    .map(({ group: { id } }) => ({ field: 'id', op: '<>', value: id }))
            );
        }
        return filterBy;
    });

    _normalizeTeamMembers = (list: Array<Object>, assignee: Object, owner: Object, searchValue: string, type: string) => (list || []).filter((item) => {
        const isUser = get(item, 'user.id') && get(item, 'user.id') !== get(owner, 'id') && get(item, 'user.id') !== get(assignee, 'id');
        const isGroup = get(item, 'group.id');
        let isSearchable = true;
        if(isUser && searchValue) {
            isSearchable = isIncludes(`${getStr(item, 'user.name') || ''} ${getStr(item, 'user.login') || ''}`, searchValue);
        }
        if(isGroup && searchValue) {
            isSearchable = isIncludes(getStr(item, 'group.name') || '', searchValue);
            get(item, 'group.users') || [].forEach((u) => {
                if (isSearchable) {
                    isSearchable = isIncludes(`${getStr(u, 'name') || ''} ${getStr(u, 'login') || ''}`, searchValue);
                }
            });
        }
        return item.type === type && (isUser || isGroup) && isSearchable;
    })

    normalizeTeamMembers = memoize((list: Array<Object>, assignee: Object, owner: Object, searchValue: string) => {
        const participants = this._normalizeTeamMembers(list, assignee, owner, searchValue, 'participant');
        const candidates = this._normalizeTeamMembers(list, assignee, owner, searchValue, 'candidate');
        return {
            participants,
            candidates
        };
    })

    onSearch = (event) => {
        this.setState({
            searchValue: event.target.value,
        });
    }

    /**
     * @override
     */
    render() {
        const { reloadDetails, type, details, addTeamMembersTaskLoading, addTeamMembersProcessLoading } = this.props;
        const { searchValue } = this.state;
        const { id, teamMembers, assignee, endDate, createdBy } = details || {};
        const owner = type === 'task' ? get(this.props.details, 'owner') : createdBy;
        const { participants, candidates } = this.normalizeTeamMembers(teamMembers, assignee, owner, searchValue);
        const canAdd = !endDate && !!reloadDetails;
        return (
            <ContentArea>
                <SearchField
                    fullWidth
                    variant="standard"
                    margin="none"
                    placeholder="Search..."
                    InputProps={{ disableUnderline: true }}
                    value={searchValue}
                    onChange={this.onSearch}
                />
                <Container width="1024" style={{ height: '100%' }}>
                    {owner && (
                        <Fragment>
                            <ListGroup name="Owner" />
                            <List>
                                <ListItem
                                    component={<Avatar src={owner.image} name={owner.name} size="lg" status="busy" />}
                                    title={<PeopleLink id={owner.id}>{owner.name}</PeopleLink>}
                                    subTitle={`@${owner.login}`}
                                    raised
                                />
                            </List>
                        </Fragment>
                    )}
                    {assignee && (
                        <Fragment>
                            <ListGroup name="Assignee" />
                            <List>
                                <ListItem
                                    component={<Avatar src={assignee.image} name={assignee.name} size="lg" status="busy" />}
                                    title={<PeopleLink id={assignee.id}>{assignee.name}</PeopleLink>}
                                    subTitle={`@${assignee.login}`}
                                    raised
                                />
                            </List>
                        </Fragment>
                    )}
                    <ListGroup
                        name="Team members"
                        actions={canAdd && <Button variant="text" onClick={this.toggleAddUser}>Add</Button>}
                    />
                    {participants.length > 0 ?
                        this.buildList(participants, endDate, !!reloadDetails)
                        : <div style={{textAlign: 'center'}}>No Team Members</div>
                    }
                    {candidates.length > 0 && (
                        <Fragment>
                            <ListGroup name="Candidate users" />
                            {this.buildList(candidates, endDate, false)}
                        </Fragment>
                    )}
                </Container>
                {!endDate && (
                    <AddTeamMemberModal
                        id={id}
                        type={type}
                        userFilterBy={this.buildUserFilterBy(owner, assignee, teamMembers)}
                        groupFilterBy={this.buildGroupFilterBy(teamMembers)}
                        open={this.state.isAddTeamOpen}
                        onToggle={this.toggleAddUser}
                        onChange={this.addTeamMembers}
                        loading={addTeamMembersTaskLoading || addTeamMembersProcessLoading}
                    />
                )}
            </ContentArea>
        );
    }
}

export default connect(state => ({
    addTeamMembersTaskLoading: state.abox.task.addTeamMembers.isLoading,
    addTeamMembersProcessLoading: state.abox.process.addTeamMembers.isLoading,
}), {
    addTeamMemberToTask,
    removeTeamMemberFromTask,
    addTeamMemberToProcess,
    removeTeamMemberFromProcess,
})(AboxTeam);

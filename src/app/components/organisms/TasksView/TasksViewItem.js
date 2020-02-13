// @flow

import { connect } from 'react-redux';
import { isBrowser } from 'react-device-detect';
import { Menu, MenuItem, Divider } from '@mic3/platform-ui';
import memoize from 'memoize-one';
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';

import { closeTask } from 'store/actions/abox/taskActions';
import { formatDate } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { loadMessenger } from 'store/actions/messenger/messengerActions';
import AboxCircularProgressBar from 'app/components/atoms/CircularProgressBar/AboxCircularProgressBar';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Flex from 'app/components/atoms/Flex/Flex';
import history from 'store/History';
import ListItem from 'app/components/molecules/List/ListItem';
import TaskLink from 'app/components/atoms/Link/TaskLink';

const ListItemStyled = styled(ListItem)`
width: 100%;
max-width: 1024px;
margin: 0 auto;
@media (max-width: 1100px ) {
    padding-right: 2rem;
}
${({ disabled }) => disabled ? 'opacity: 0.1;' : '' }
`;

const DesktopItems = styled(Flex)`
@media (min-width: ${({ theme }) => theme.media.md}) {
    min-width: 190px;
}
`;

const ButtonIconStyled = styled(ButtonIcon)`
padding: 0.3rem;
& *, & i:before {
    color: rgba(255, 255, 255, 0.6) !important;
}
& span {
    font-size: 0.8rem !important;
    margin-left: 0.6rem;
}
`;

const Badge = styled.span`
color: rgba(255,255,255,0.5);
`;

const ResponsiveLabelStyled = ({ count, label, icon, type, onClick }: Object) => isBrowser ? (
    <ButtonIconStyled type={type} icon={icon} label={count} onClick={onClick} />
) : (
    <Flex onClick={onClick}>
        <ButtonIconStyled type={type} icon={icon} label={label} />
        <Badge>{count}</Badge>
    </Flex>
);

/**
 * A single task item
 */
class TaskListItem extends PureComponent<Object, Object> {

    // $FlowFixMe
    anchorDotsEl = React.createRef();

    constructor(props: Object) {
        super(props);
        this.state = {
            commentCount: (props.data.comments || []).length,
            attachmentsCount: props.data._attachmentsCount || 0,
        };
    }

    componentDidUpdate(prevProps: Object) {
        const { data, message, handleDelete } = this.props;
        if(message && message !== prevProps.message && message.id === data.id) {
            const commentCount = get(message, 'comments.length') || 0;
            const prevCommentCount = get(prevProps, 'message.comments.length') || 0;
            const attachmentsCount = get(message, '_attachmentsCount') || 0;
            if (commentCount !== prevCommentCount) {
                this.setState({ commentCount, attachmentsCount });
            }
        }
        if(!message && message !== prevProps.message && prevProps.message.id === data.id) {
            // we disable item because when message === null we don't have permissions to it and to task also
            handleDelete(data.id);
        }
    }

    loadMessenger = () => this.props.loadMessenger(this.props.data.id, 'task').then(() => {this.closeMenu();});
    goToTask = () => history.push(`/abox/task/${this.props.data.id}`);
    goToSubtasks = () => history.push(`/abox/task/${this.props.data.id}/subtasks`);
    gotToAttachments = () => history.push(`/abox/task/${this.props.data.id}/attachments`);
    toggleMenu = () => this.setState(state => ({ isMenuOpen: !state.isMenuOpen }));
    closeMenu = () => this.setState({ isMenuOpen: false });
    handleCloseTask = () => this.props.closeTask(this.props.data.id).then((response) => {
        if (response instanceof Error) return;
        this.props.resetView();
    });

    buildDesktopMenuItems = memoize((id, childrenCount, commentCount, attachmentsCount) => [
        <TaskLink key={1} id={id} path="subtasks" noDecoration>
            <ResponsiveLabelStyled type="af" icon={'subtask-tree'} count={childrenCount} label={'Subtasks'} />
        </TaskLink>,
        <ResponsiveLabelStyled key={2} onClick={this.loadMessenger} type="af" icon={'messenger'} count={commentCount.toString()} label={'Chat'} />,
        <TaskLink key={3} id={id} path="attachments" noDecoration>
            <ResponsiveLabelStyled icon="paperclip" count={attachmentsCount.toString()} label={'Add attachments'} />
        </TaskLink>
    ])

    buildMobileMenuItems = memoize((id, childrenCount, commentCount, attachmentsCount) => [
        <MenuItem key={1} onClick={this.goToSubtasks}>
            <ResponsiveLabelStyled type="af" icon={'subtask-tree'} count={childrenCount} label={'Subtasks'} />
        </MenuItem>,
        <MenuItem key={2} onClick={this.loadMessenger}>
            <ResponsiveLabelStyled type="af" icon={'messenger'} count={commentCount.toString()} label={'Chat'} />
        </MenuItem>,
        <MenuItem key={3} onClick={this.gotToAttachments}>
            <ResponsiveLabelStyled icon="paperclip" count={attachmentsCount.toString()} label={'Add attachments'} />
        </MenuItem>
    ])

    render() {
        const { data: { priority, variable, name, id, dueDate, endDate, _childrenCount }, isDeleted } = this.props;
        const { completion } = variable || {};
        const { commentCount, attachmentsCount, isMenuOpen } = this.state;
        const childrenCount = `${_childrenCount || 0}`;
        return (
            <ListItemStyled
                disabled={isDeleted}
                component={<AboxCircularProgressBar percentage={completion} priority={priority} disabled={!!endDate} />}
                title={<TaskLink id={id}>{name || 'No Name'}</TaskLink>}
                subTitle={<Fragment><TaskLink id={id}>#{id}</TaskLink>, Due {formatDate(dueDate)}</Fragment>}
                actions={
                    <Flex>
                        {isBrowser && (
                            <DesktopItems spaceBetween>
                                {this.buildDesktopMenuItems(id, childrenCount, commentCount, attachmentsCount)}
                            </DesktopItems>
                        )}
                        <span ref={this.anchorDotsEl}><ButtonIconStyled icon="dots-vertical" onClick={this.toggleMenu} /></span>
                        <Menu open={isMenuOpen} anchorEl={this.anchorDotsEl.current} onClose={this.toggleMenu} >
                            <MenuItem onClick={this.goToTask}>
                                <ButtonIconStyled icon="login-variant" label="Go to task" />
                            </MenuItem>
                            {!isBrowser && (
                                <Fragment>
                                    <Divider />
                                    {this.buildMobileMenuItems(id, childrenCount, commentCount, attachmentsCount)}
                                </Fragment>
                            )}
                            <Divider />
                            <MenuItem onClick={this.handleCloseTask}>
                                <ButtonIconStyled icon="check" label="Close task" />
                            </MenuItem>
                        </Menu>
                    </Flex>
                }
                raised
            />
        );
    }
};

export default connect(
    state => ({
        message: state.chat.messages,
    }),
    {
        loadMessenger,
        closeTask
    }
)(TaskListItem);

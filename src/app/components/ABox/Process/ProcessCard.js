/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadMessenger } from 'store/actions/messenger/messengerActions';
import styled from 'styled-components';
import moment from 'moment';
import memoize from 'memoize-one';

import Loader from 'app/components/atoms/Loader/Loader';
import WidgetHeader from 'app/components/atoms/WidgetHeader/WidgetHeader';
import AboxProgressBar from 'app/components/molecules/ProgressBar/AboxProgressBar';
import ProcessLink from 'app/components/atoms/Link/ProcessLink';
import Title from 'app/components/atoms/Title/Title';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';
import WidgetFooter from 'app/components/atoms/WidgetFooter/WidgetFooter';
import TaskProgressBlock from 'app/components/molecules/TastProgressBlock/TaskProgressBlock';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import Modal from 'app/components/molecules/Modal/Modal';
import AboxTeam from 'app/components/ABox/Team/AboxTeam';
import ProcessCardSummaryItemContainer from 'app/containers/Abox/ProcessView/ProcessCardSummaryItemContainer';
import PopupMenu from 'app/components/molecules/PopupMenu/PopupMenu';
import ProcessIcon from 'app/components/atoms/Icon/ProcessIcon';
import { loadProcessTasks } from 'store/actions/abox/taskActions';
import { loadProcessDetails } from 'store/actions/abox/processActions';
import { get } from 'app/utils/lo/lo';

const CardStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
    border-radius: 0.2rem;
    margin: 1rem 1rem 0 1rem;
    background: ${({ theme }) => theme.widget.background};
    box-shadow: ${({ theme }) => theme.shadow.z1};
    ${({ disabled }) => disabled ? 'opacity: 0.1;' : '' }
`;

const TitleWrapper = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ProgressWrapper = styled.div`
    padding: 0 1rem 1rem 1rem;
`;

const TaskBlocksWrapper = styled.div`
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: auto;
    padding: 0 1rem 0 1rem;
`;

const Footer = styled(WidgetFooter)`
    & .FooterIcons {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        @media (min-width: ${({ theme }) => theme.media.md}) {
            flex-grow: 0;
            margin-left: auto;
            width: 40%;
        }
    }
`;

const HrStyled = styled.div`
    width: 100%;
    border: 0;
    position: relative;
    height: .2rem;
    &:before {
        content: '';
        height: .2rem;
        position: absolute;
        bottom: 50%;
        border-bottom: 1px #5d5d5d solid;
        width: 100%;
        z-index:0;
    }
`;

const HeaderActionPopoverContent = ({ onCancel }) => (
    <MenuItem name="Cancel Process" icon="cancel" onClick={onCancel} />
);

/**
 *
 */
class ProcessCard extends PureComponent<Object, Object> {

    /**
     * Define our prop-types for A-Box card
     */
    static propTypes = {
        data: PropTypes.object,
        index: PropTypes.number,
        resetView: PropTypes.func,
        forceUpdateGrid: PropTypes.func,
        profile: PropTypes.object,
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            commentCount: get(props.data, 'comments.length') || 0,
            teamMembersCount: this.getTeamMembersLentgh(get(props.data, 'teamMembers')),
            attachmentsCount: get(props.data, 'attachments.length') || 0,
            openedTeam: false,
        };
        props.loadProcessTasks(props.data.id);
    }

    componentDidUpdate(prevProps: Object) {
        const { data, message, tasks, details } = this.props;
        if (details !== prevProps.details && get(details, 'id') === data.id) {
            const teamMembersCount = this.getTeamMembersLentgh(get(details, 'teamMembers'));
            const prevTeamMembersCount = this.getTeamMembersLentgh(get(prevProps, 'details.teamMembers'));
            if (teamMembersCount !== prevTeamMembersCount) {
                this.setState({ teamMembersCount });
            }
        }

        if(message !== prevProps.message && message.id === data.id) {
            const commentCount = get(message, 'comments.length') || 0;
            const prevCommentCount = get(prevProps, 'message.comments.length') || 0;
            const attachmentsCount = get(message, 'attachments.length') || 0;
            if (commentCount !== prevCommentCount) {
                this.setState({ commentCount, attachmentsCount });
            }
        }

        if (prevProps.tasks !== tasks) {
            this.props.resizeRow();
        }
    }

    getTeamMembersLentgh = (teamMembers: any = []) =>
        teamMembers.filter(member => get(member, 'user') || get(member, 'group')).length;


    toggleTeam = (index: number) => this.setState({ openedTeam: !this.state.openedTeam }, this.props.forceUpdateGrid);
    onDeleteTeamMember = (member) => {
        const { profile } = this.props;
        if(member.id === profile.id && !profile.isAdmin) {
            this.setState({ openedTeam: false }, this.props.resetView);
        }
    };

    cancelProcess = () => this.props.cancelProcess(this.props.data.id);

    openMessenger = id => this.props.loadMessenger(this.props.data.id, 'process');

    getProcessSummaryData = memoize((definition, variables) => {
        return definition.filter(item => item && !item.hide).map(({ name, label, format }) => {
            const value = format ? variables[name] && moment(variables[name]).format(format) : variables[name];
            return { key: label || 'No Label', value: value || 'No Value' };
        });
    })

    buildTasks = memoize((tasks, createdBy)=> (
        <TaskBlocksWrapper>
            {(tasks || []).map((task, index) => <TaskProgressBlock key={`${task.label}_${index}`} {...task} owner={createdBy} />)}
        </TaskBlocksWrapper>
    ))

    reloadDetails = () => {
        this.props.loadProcessDetails(this.props.data.id);
    }

    /**
     * Render our abox card
     */
    render() {
        const { openedTeam, commentCount, teamMembersCount, attachmentsCount } = this.state;
        const { data, isDeleted, tasks, isTaskLoading, details } = this.props;
        const { name = 'No Name', summary = {}, id, createdBy } = data;
        const { variables, definition = [] } = summary;
        const processSummary = this.getProcessSummaryData(definition, variables);
        const icon = get(data, 'processDefinition.deployedModel.modelData.icon') || 'arrange-bring-to-front';
        const { progress, priority } = data.variables || {};
        return (
            <CardStyle disabled={isDeleted}>
                <WidgetHeader>
                    <ProcessIcon name={icon} disabled={data.endDate} priority={priority} />
                    <TitleWrapper>
                        <Title as="h2">
                            <ProcessLink id={id}>{name}</ProcessLink>
                        </Title>
                        <ProcessLink id={id}><Title as="h4">{`#${id}`}</Title></ProcessLink>
                    </TitleWrapper>
                    <HeaderActions>
                        <PopupMenu placement="top right" content={<HeaderActionPopoverContent onCancel={this.cancelProcess} />}>
                            <ButtonIcon icon="dots-vertical" />
                        </PopupMenu>
                    </HeaderActions>
                </WidgetHeader>
                <ProgressWrapper>
                    <AboxProgressBar value={progress || 0} priority={priority} disabled={!!data.endDate} />
                </ProgressWrapper>
                <ProcessCardSummaryItemContainer summary={processSummary} />
                <HrStyled />
                {isTaskLoading ? <Loader /> : this.buildTasks(tasks, createdBy)}
                <HrStyled />
                <Footer>
                    <div className="FooterIcons">
                        <ButtonIcon icon="account-multiple" onClick={this.toggleTeam} label={teamMembersCount.toString()} />
                        <Modal title="Team" open={openedTeam} onToggle={this.toggleTeam} disableBack>
                            <AboxTeam
                                type="process"
                                details={data.id === get(details, 'id') ? details : data}
                                onDelete={this.onDeleteTeamMember}
                                reloadDetails={this.reloadDetails}
                            />
                        </Modal>
                        <ButtonIcon icon="messenger" type="af" title="Open messenger" onClick={this.openMessenger} label={commentCount.toString()} />
                        <ProcessLink id={id} path="attachments">
                            <ButtonIcon icon="paperclip" label={attachmentsCount.toString()} />
                        </ProcessLink>
                    </div>
                </Footer>
            </CardStyle>
        );
    }
}

export default connect(
    (state, props) => {
        const processId = props.data.id;
        const tasks = state.abox.process.tasks[processId] || {};
        return {
            message: state.chat.messages,
            isTaskLoading: tasks.isLoading,
            tasks: tasks.data,
            details: state.abox.process.details.data,
            profile: state.user.profile,
        };
    },
    {
        loadMessenger,
        loadProcessTasks,
        loadProcessDetails
    }
)(ProcessCard);

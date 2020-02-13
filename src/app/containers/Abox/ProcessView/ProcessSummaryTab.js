/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { onlyUpdateForKeys } from 'recompose';
import { Col, Row } from 'react-styled-flexboxgrid';

import AboxAttachmentsCard from 'app/components/ABox/Cards/AboxAttachmentsCard';
import AboxCommentsCard from 'app/components/ABox/Cards/AboxCommentsCard';
import ProcessLink from 'app/components/atoms/Link/ProcessLink';
import TaskLink from 'app/components/atoms/Link/TaskLink';
import ProcessSlider from 'app/components/ABox/Process/ProcessSlider';
import AboxTeamCard from 'app/components/ABox/Cards/AboxTeamCard';
import AboxProgressBar from 'app/components/molecules/ProgressBar/AboxProgressBar';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import Container from 'app/components/atoms/Container/Container';
import Card from 'app/components/molecules/Card/Card';
import Icon from 'app/components/atoms/Icon/Icon';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Loader from 'app/components/atoms/Loader/Loader';
import Label from 'app/components/molecules/Label/Label';
import Text from 'app/components/atoms/Text/Text';
import history from 'store/History';
import { get } from 'app/utils/lo/lo';
import { loadProcessDetails } from 'store/actions/abox/processActions';
import { loadProcessTasks } from 'store/actions/abox/taskActions';
import { loadMessenger } from 'store/actions/messenger/messengerActions';
import { getStr } from 'app/utils/utils';
import { normalizePriorityValue } from 'app/config/aboxConfig';

const CustomIcon = styled(Icon)`
    cursor: default;
`;
const RowStyled = styled(Row)`
    margin-bottom: 1rem;
`;

const TasksCard = onlyUpdateForKeys(['process', 'tasks'])((props: Object) => {
    return (props.tasks || [])
        .slice(0, 10)
        .map(({ id, name, variable, assignee, priority, endDate }) => (
            <RowStyled key={id} title={`Assigned by ${(assignee && assignee.name) || 'none'} and has priority ${normalizePriorityValue(priority)}`}>
                <Col xs={1} sm={1} md={1} lg={1}>
                    <CustomIcon name="task-list" type="af"/>
                </Col>
                <Col xs={11} sm={11} md={11} lg={11}>
                    <TaskLink id={id} noDecoration>
                        <Text>{name || 'No Name'}</Text>
                        <AboxProgressBar value={variable && variable.completion} priority={priority} disabled={!!endDate} />
                    </TaskLink>
                </Col>
            </RowStyled>
        ));}

);

const ParentCard = onlyUpdateForKeys(['parent'])((props: Object) => {
    const initiatedBy = get(props, 'parent.initiatedBy');
    if (!initiatedBy || !initiatedBy.id) {
        return <div>This process has no parent.</div>;
    }
    return (
        <Fragment>
            <InputWrapper>
                <Label text="ID" />
                <ProcessLink id={initiatedBy.id} noDecoration>#{initiatedBy.id}</ProcessLink>
            </InputWrapper>
            <InputWrapper>
                <Label text="Name" />
                {initiatedBy.name || 'none'}
            </InputWrapper>
            <InputWrapper>
                <Label text="Parent Definition" />
                {get(initiatedBy, 'processDefinition.name') || 'none'}
            </InputWrapper>
        </Fragment>
    );
});

const ActivityCard = onlyUpdateForKeys(['children'])(({ children }: Object) => {
    if (!(children || []).length) {
        return 'This process has no sub-processes.';
    }
    return (children || [])
        .slice(0, 10)
        .map(({ id, name, variables, endDate, createdBy }) => {
            const { progress, priority } = variables || {};
            return (
                <RowStyled key={id} title={`Assigned by ${(createdBy && createdBy.name) || 'none'} and has priority ${normalizePriorityValue(priority)}`}>
                    <Col xs={1} sm={1} md={1} lg={1}>
                        <CustomIcon name="task-list" type="af"/>
                    </Col>
                    <Col xs={11} sm={11} md={11} lg={11}>
                        <ProcessLink id={id} noDecoration>
                            <Text>{name || 'No Name'}</Text>
                            <AboxProgressBar value={progress || 0} priority={priority} disabled={!!endDate} />
                        </ProcessLink>
                    </Col>
                </RowStyled>
            );
        });
});

/**
 *
 */
class ProcessSummaryTab extends PureComponent<Object, Object> {

    static propTypes = {
        details: PropTypes.object,
        children: PropTypes.array,
        isTasksLoading: PropTypes.bool,
        tasks: PropTypes.array,
        loadProcessTasks: PropTypes.func,
        loadProcessDetails: PropTypes.func,
    };

    static defaultProps = {
        children: [],
        tasks: [],
        isTasksLoading: false,
    };

    constructor(props: Object) {
        super(props);
        props.loadProcessDetails(this.props.details.id);
        props.loadProcessTasks(this.props.details.id);
    };

    showTeamTab = () => {
        history.push(`/abox/process/${this.props.details.id}/team`);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.details !== this.props.details) {
            this.props.loadProcessTasks(this.props.details.id);
        }
    }

    loadMessenger = () => this.props.loadMessenger(this.props.details.id, 'process');

    /**
     * @override
     */
    render(): Object {
        const { details, children, tasks, profileId } = this.props;
        const { name, teamMembers, attachments, variables, comments, status, summary, endDate } = details;
        return (
            <ContentArea>
                <ProcessSlider summary={summary}/>
                <Container>
                    <Row>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <AboxTeamCard teamMembers={teamMembers} action={this.showTeamTab}/>
                            <AboxCommentsCard profileId={profileId} comments={comments} loadMessenger={this.loadMessenger}/>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <AboxAttachmentsCard attachments={attachments}/>
                            <Card collapsible title="Parent" description={<ParentCard parent={status}/>}/>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <Card
                                title="Tasks"
                                headerActions={<Link to="tasks"><Icon name="window-maximize" size="sm"/></Link>}
                                description={this.props.isTasksLoading ? (<Loader/>) : (
                                    <TasksCard process={{ name, variables, endDate }} tasks={tasks}/>)}
                            />
                            <Card
                                title="Sub-Processes"
                                headerActions={<Link to="sub-processes"><Icon name="window-maximize" size="sm"/></Link>}
                                description={<ActivityCard children={children}/>}
                            />
                        </Col>
                    </Row>
                </Container>
            </ContentArea>
        );
    }
}

export default connect(
    (state) => {
        const id = getStr(state.abox.process.details.data, 'id') || '_';
        const tasks = state.abox.process.tasks[id] || {};
        return {
            profileId: state.user.profile.id,
            details: state.abox.process.details.data,
            children: state.abox.process.children.data,
            isTasksLoading: tasks.isLoading,
            tasks: tasks.data,
        };
    },
    { loadProcessTasks, loadProcessDetails, loadMessenger }
)(ProcessSummaryTab);

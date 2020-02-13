/* @flow */
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import AboxProgressBar from 'app/components/molecules/ProgressBar/AboxProgressBar';
import Avatar from 'app/components/molecules/Avatar/Avatar';

const TaskProgressWrapper = styled.div`
    display: inline-block;
    margin: 1rem;
`;

const TaskProgressInner = styled.div`
    display: flex;
    align-items: center;
`;

const AvatarLink = styled(Link)`
    margin: 0; padding: 0;
    line-height: 0;
`;

const TaskProgressAvatar = styled(Avatar)`
    margin: 0 .5rem 0 0;
`;

// We can use our Label component here, but It does nto show the the pointer cursor inside the link, this is why we are using span
const TasksLabel = styled.span`
    display: inline-block;
    width: 9rem;
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: capitalize;
    color: ${({ theme }) => theme.base.textColor};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const TaskInfo = styled.div`
    width: 10rem;
`;

const TaskLink = styled(Link)`
    text-decoration: none;
`;
/**
 *
 */
class TaskProgressBlock extends PureComponent<Object, Object> {
    /**
     * constructor - description
     *
     * @param  {type} props: Object description
     * @return {type}               description
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    /**
     *
     */
    showTeamModal = () => {
        this.setState(prevState => ({ showModal: !prevState.showModal }));
    };
    /**
     * render - description
     *
     * @return {type}  description
     */
    render() {
        const { name, variable, id, assignee, endDate, priority } = this.props;
        const { completion } = variable || {};
        return (
            <TaskProgressWrapper>
                <TaskProgressInner>
                    {assignee && assignee.id ? (
                        <AvatarLink to={`/people/${assignee.id}/summary`}>
                            <TaskProgressAvatar title={assignee.name || 'No Name'} name={(assignee && assignee.name) || 'No Name'} src={assignee.image} size="lg" />
                        </AvatarLink>
                    ) : (
                        <TaskProgressAvatar title={(assignee && assignee.name) || 'No Name'} name={(assignee && assignee.name) || 'No Name'} src={(assignee && assignee.image)} size="lg" />
                    )}
                    <TaskLink to={`/abox/task/${id}`}>
                        <TaskInfo>
                            <TasksLabel title={name}>{name || 'No Name'}</TasksLabel>
                            <AboxProgressBar value={completion || 0} priority={priority} disabled={!!endDate} />
                        </TaskInfo>
                    </TaskLink>
                </TaskProgressInner>
            </TaskProgressWrapper>
        );
    }
}

export default TaskProgressBlock;

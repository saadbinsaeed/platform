// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import memoize from 'memoize-one';

import ListItem from 'app/components/molecules/List/ListItem';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import ResizableListItem from 'app/components/molecules/VirtualList/ResizableListItem';
import AboxCircularProgressBar from 'app/components/atoms/CircularProgressBar/AboxCircularProgressBar';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';
import { formatDate } from 'app/utils/date/date';
import { loadMessenger } from 'store/actions/messenger/messengerActions';
import { get } from 'app/utils/lo/lo';
import { cut } from 'app/utils/string/string-utils';
// import { bmpnVariablesToObject } from 'app/utils/bpmn/bpmnEngineUtils';


const CardContainer = styled.div`
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
`;

const CommentsStyled = styled.div`
    color: ${({ theme }) => `${theme.base.textColor}55`};
    font-style: italic;
    max-width: 30%;
`;

/**
 * A single task item
 */
class DashboardTaskListItem extends PureComponent<Object, Object> {

    constructor(props: Object) {
        super(props);
        const { data: { comments }} = props;
        this.state = { commentCount: (comments || []).length, comments };
    }

    componentDidUpdate(prevProps: Object) {
        const { data, message } = this.props;
        const commentCount = get(this.props, 'message.comments.length') || 0;
        const prevCommentCount = get(prevProps, 'message.comments.length') || 0;
        if (commentCount !== prevCommentCount && message.id === data.id) {
            this.setState({ commentCount, comments: message.comments });
        }
    }

    openMessenger = id => this.props.loadMessenger(this.props.data.id, 'task');

    renderLastComments = memoize(comments => cut(String(get(comments, '[0].message.plainMessage', 'No comments')), 35));

    render() {
        const { data: { startDate: created, priority, variable, name, id, dueDate, assignee, endDate }, index, resize, style } = this.props;
        const { completion } = variable || {};
        return (
            <ResizableListItem style={style} key={index} index={index} resize={resize} padding={15}>
                {resizeRow => (
                    <CardContainer>
                        <ListItem
                            component={<AboxCircularProgressBar percentage={completion} priority={priority} disabled={!!endDate}/>}
                            title={<Link to={`/abox/task/${id}`}>{name || 'No Name'}</Link>}
                            subTitle={
                                <Fragment>
                                    #{id}
                                    {created && <div>Created {formatDate(created)}</div>}
                                    {/* startDate && <div>Started {formatDate(startDate)}</div> */}
                                    {dueDate && <div>Due {formatDate(dueDate)}</div>}
                                    {assignee && <div>Assignee <PeopleLink id={assignee.id}>{assignee.name}</PeopleLink></div>}
                                </Fragment>
                            }
                            text={<CommentsStyled>{this.renderLastComments(this.state.comments)}</CommentsStyled>}
                            actions={<ButtonIcon type="af" icon={'messenger'} onClick={this.openMessenger} label={this.state.commentCount.toString()} />}
                            raised />
                    </CardContainer>
                )}
            </ResizableListItem>
        );
    }
};

export default connect(
    state => ({
        message: state.chat.messages,
    }),
    {
        loadMessenger,
    }
)(DashboardTaskListItem);

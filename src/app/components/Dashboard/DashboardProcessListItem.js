// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import memoize from 'memoize-one';
import moment from 'moment';
import { Menu, MenuItem } from '@mic3/platform-ui';
import { isBrowser } from 'react-device-detect';

import ListItem from 'app/components/molecules/List/ListItem';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import ResizableListItem from 'app/components/molecules/VirtualList/ResizableListItem';
import AboxCircularProgressBar from 'app/components/atoms/CircularProgressBar/AboxCircularProgressBar';
import ProcessLink from 'app/components/atoms/Link/ProcessLink';
import Ticker from 'app/components/molecules/Ticker/Ticker';
import { formatDate, formatInterval } from 'app/utils/date/date';
import { loadMessenger } from 'store/actions/messenger/messengerActions';
import { get } from 'app/utils/lo/lo';
import { cut } from 'app/utils/string/string-utils';
import { getNum } from 'app/utils/utils';
import history from 'store/History';
import Flex from 'app/components/atoms/Flex/Flex';

const CardContainer = styled.div`
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
`;

const DesktopItems = styled(Flex)`
@media (min-width: ${({ theme }) => theme.media.md}) {
    min-width: 120px;
}
`;

const CommentsStyled = styled.div`
    color: ${({ theme }) => `${theme.base.textColor}55`};
    font-style: italic;
    max-width: 30%;
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

const DurationComponent = ({ startDate, endDate, time, label }) => {
    if (startDate && endDate) {
        // $FlowFixMe
        return formatInterval(moment(endDate) - moment(startDate));
    }
    // $FlowFixMe
    return `${label} ${formatInterval(moment(time) - moment(startDate))}`;
};

/**
 * A single task item
 */
class DashboardProcessListItem extends PureComponent<Object, Object> {

    // $FlowFixMe
    anchorDotsEl = React.createRef();

    constructor(props: Object) {
        super(props);
        const { data: { comments }} = props;
        this.state = { commentCount: (comments || []).length, comments, isMenuOpen: false };
    }

    componentDidUpdate(prevProps: Object) {
        const { data, message } = this.props;
        const commentCount = get(this.props, 'message.comments.length') || 0;
        const prevCommentCount = get(prevProps, 'message.comments.length') || 0;
        if (commentCount !== prevCommentCount && message.id === data.id) {
            this.setState({ commentCount, comments: message.comments });
        }
    }

    toggleMenu = () => this.setState(state => ({ isMenuOpen: !state.isMenuOpen }));
    openMessenger = id => this.props.loadMessenger(this.props.data.id, 'process');

    renderLastComments = memoize(comments => cut(String(get(comments, '[0].message.plainMessage', 'No comments')), 35));

    buildDesktopMenu = memoize((tasks, commentCount, id) => (
        <DesktopItems spaceBetween>
            <ProcessLink key={1} id={id} path="tasks">
                <ResponsiveLabelStyled type="af" icon={'task-list'} count={tasks.length.toString()} label={'Subtasks'} />
            </ProcessLink>
            <ResponsiveLabelStyled key={2} type="af" icon={'messenger'} onClick={this.openMessenger} count={commentCount.toString()} label={'Chat'} />
        </DesktopItems>

    ))

    goToProcessTasks = () => history.push(`/abox/process/${this.props.data.id}/tasks`);
    buildMobileMenu = memoize((tasks, commentCount, id, isMenuOpen) => (
        <Fragment>
            <span ref={this.anchorDotsEl}><ButtonIconStyled icon="dots-vertical" onClick={this.toggleMenu} /></span>
            <Menu open={isMenuOpen} anchorEl={this.anchorDotsEl.current} onClose={this.toggleMenu} >
                <MenuItem onClick={this.goToProcessTasks}>
                    <ResponsiveLabelStyled type="af" icon={'task-list'} count={tasks.length.toString()} label={'Subtasks'} />
                </MenuItem>
                <MenuItem  onClick={this.openMessenger}>
                    <ResponsiveLabelStyled type="af" icon={'messenger'} onClick={this.openMessenger} count={commentCount.toString()} label={'Chat'} />
                </MenuItem>
            </Menu>
        </Fragment>
    ));

    render() {
        const { data: { variables, name, id, businessKey, createDate, tasks, status, endDate }, index, resize, style } = this.props;
        const { commentCount, isMenuOpen } = this.state;
        const progress = Math.floor(getNum(variables, 'progress') || 0);
        const priority = getNum(variables, 'priority', 3);
        const region = get(status, 'payload.maintenancesite.region');
        return (
            <ResizableListItem style={style} key={index} index={index} resize={resize} padding={15}>
                {resizeRow => (
                    <CardContainer>
                        <ListItem
                            component={<AboxCircularProgressBar percentage={progress} priority={priority} disabled={!!endDate} />}
                            title={<Link to={`/abox/process/${id}`}>{name || 'No Name'}</Link>}
                            subTitle={
                                <Fragment>
                                    <Link to={`/abox/process/${id}`} >#{id}</Link>
                                    {businessKey && <div>Company {businessKey}</div>}
                                    {region && <div>Region {region}</div>}
                                    {createDate && <div>Created {formatDate(createDate)}</div>}
                                    <Ticker
                                        intervalTime={60000}
                                        RenderComponent={
                                            ({ time }) => <DurationComponent
                                                time={time}
                                                startDate={createDate}
                                                endDate={endDate}
                                                label="Duration"
                                            />
                                        }
                                    />
                                </Fragment>
                            }
                            text={<CommentsStyled>{this.renderLastComments(this.state.comments)}</CommentsStyled>}
                            actions={ isBrowser
                                ? this.buildDesktopMenu(tasks, commentCount, this.props.data.id)
                                : this.buildMobileMenu(tasks, commentCount, this.props.data.id, isMenuOpen)
                            }
                            raised
                        />
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
)(DashboardProcessListItem);

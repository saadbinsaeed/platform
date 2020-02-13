/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { onlyUpdateForKeys } from 'recompose';

import Icon from 'app/components/atoms/Icon/Icon';
import AboxProgressBar from 'app/components/molecules/ProgressBar/AboxProgressBar';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import DataTableClient from 'app/components/molecules/DataTable/DataTableClient/DataTableClient';
import PriorityRenderer from 'app/components/molecules/Grid/Renderers/Priority/PriorityRenderer';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { loadProcessTasks } from 'store/actions/abox/taskActions';
import Loader from 'app/components/atoms/Loader/Loader';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import Flex from 'app/components/atoms/Flex/Flex';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';
import { getStr } from 'app/utils/utils';

const TaskLink = styled(Link)`
    text-decoration: none;
`;

const CustomIcon = styled(Icon)`
    cursor: default;
`;

const AssigneeAvatarStyle = styled.div`
    display: flex;
    justify-content: center;
`;

const TaskBarRenderer = onlyUpdateForKeys(['data'])((props: Object) => {
    const { data: { id, name, variable, endDate, priority } } = props;
    const { completion } = variable || {};
    return (
        <Flex>
            <CustomIcon name="task-list" type="af"/>
            &nbsp;&nbsp;
            <TaskLink to={`/abox/task/${id}`}>
                #{id} - {name || 'No Name'}
                <AboxProgressBar value={completion || 0} priority={priority} disabled={!!endDate} />
            </TaskLink>
        </Flex>
    );
});

const AssigneeAvatarRenderer = (props: Object) => {
    const { value, data: { assignee } } = props;
    return (
        <AssigneeAvatarStyle>
            {assignee && assignee.id ? (
                <PeopleLink title={value} id={assignee.id}>
                    <Avatar size="lg" src={assignee.image} name={assignee.name || 'No Name'}/>
                </PeopleLink>
            ) : 'No Assignee'
            }
        </AssigneeAvatarStyle>
    );
};
const DurationRenderer = (props: Object) => {
    const { data: { startDate, endDate } } = props;
    const start_date = startDate ? moment(startDate) : moment();
    const end_date = endDate ? moment(endDate) : moment();
    const diff = end_date.diff(start_date);
    const duration = moment.utc(diff).format('HH:mm:ss');
    return <div>{duration}</div>;
};

/**
 *
 */
class ProcessTasksTab extends PureComponent<Object, Object> {
    static propTypes = {
        details: PropTypes.object,
        isLoading: PropTypes.bool,
        tasks: PropTypes.array,
        loadProcessTasks: PropTypes.func.isRequired,
    };

    static defaultProps = {
        details: {},
        isLoading: false,
        tasks: [],
    };

    columnDefinitions: Array<Object>;

    /**
     * constructor - description
     *
     * @param  {type} props: Object description
     * @return {type}               description
     */
    constructor(props: Object) {
        super(props);
        this.columnDefinitions = [
            { header: 'ID', field: 'id', bodyComponent: TaskBarRenderer, style: { width: '340px' } },
            {
                header: 'Assignee',
                field: 'assignee.name',
                bodyComponent: AssigneeAvatarRenderer,
                style: { width: '100px' },
            },
            {
                header: 'Priority',
                field: 'priority',
                bodyComponent: PriorityRenderer,
                style: { width: '100px', textAlign: 'center' },
            },
            { header: 'Created', field: 'startDate', type: 'date', style: { width: '160px' } },
            // { header: 'Due', field: 'due', style: { width: '160px' } },  // No specs
            // { header: 'Modified', field: 'modifiedDate', style: { width: '160px' } },// No specs
            { header: 'Closed', field: 'endDate', type: 'date', style: { width: '160px' } },
            { header: 'Duration', field: '__duration__', bodyComponent: DurationRenderer, style: { width: '160px' } },
        ].map(column => ({ ...column, filter: false, sortable: false }));
    }

    componentDidMount() {
        if (this.props.details && this.props.details.id) {
            this.props.loadProcessTasks(this.props.details.id);
        }
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.details !== this.props.details &&
            (prevProps.details && prevProps.details.id) !== (this.props.details && this.props.details.id)
        ) {
            if (this.props.details && this.props.details.id) {
                this.props.loadProcessTasks(this.props.details.id);
            }
        }
    }

    /**
     * @override
     */
    render(): Object {
        const { details, isLoading, tasks } = this.props;
        if (isLoading) {
            return (<Loader absolute={true} />);
        }
        if (!details) {
            return (<PageNotAllowed title={'Process Tasks'} />);
        }
        return (
            <ContentArea>
                <DataTableClient
                    columnDefinitions={this.columnDefinitions}
                    value={tasks}
                    isLoading={isLoading}
                    disableCountdown={true}
                    totalRecords={(tasks && tasks.length) || 0}
                />
            </ContentArea>
        );
    }
}

export default connect((state, props) => {
    const id = getStr(state.abox.process.details.data, 'id') || '_';
    const tasks = state.abox.process.tasks[id] || {};
    const isLoading = state.abox.process.details.isLoading || tasks.isLoading;
    return {
        isLoading,
        details: state.abox.process.details.data,
        tasks: tasks.data || [],
    };
}, { loadProcessTasks })(ProcessTasksTab);

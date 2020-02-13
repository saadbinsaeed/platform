/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import Loader from 'app/components/atoms/Loader/Loader';
import { loadSubprocesses } from 'store/actions/abox/processActions';
import DataTableClient from 'app/components/molecules/DataTable/DataTableClient/DataTableClient';
import AboxProgressBar from 'app/components/molecules/ProgressBar/AboxProgressBar';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import PriorityRenderer from 'app/components/molecules/Grid/Renderers/Priority/PriorityRenderer';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import ProcessLink from 'app/components/atoms/Link/ProcessLink';
import Flex from 'app/components/atoms/Flex/Flex';
import ProcessIcon from 'app/components/atoms/Icon/ProcessIcon';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';

import { get } from 'app/utils/lo/lo';

const TaskBarRenderer = (props: Object) => {
    const { data: { id, name, variables, endDate, processDefinition } } = props;
    const { progress, priority } = variables || {};
    const iconName = get(processDefinition, 'deployedModel.modelData.icon', 'arrange-bring-to-front');
    return (
        <Flex>
            <ProcessIcon name={iconName} priority={priority} disabled={endDate} />
            &nbsp;&nbsp;
            <ProcessLink id={id} noDecoration>
                #{id} - {name || 'No Name'}
                <AboxProgressBar value={progress || 0} priority={priority} disabled={!!endDate} />
            </ProcessLink>
        </Flex>
    );
};

const AssigneeAvatarRenderer = (props: Object) => {
    const { image, id, name } = props.value;
    return (
        <PeopleLink title={name} id={id}>
            <Avatar size="lg" name={name} src={image} />
        </PeopleLink>
    );
};

const DurationRenderer = (props: Object) => {
    const { data: { createDate, endDate } } = props;
    const start_date = createDate ? moment(createDate) : moment();
    const end_date = endDate ? moment(endDate) : moment();
    const diff = end_date.diff(start_date);
    const duration = moment.utc(diff).format('DDD HH:mm:ss');
    return <div>{duration}</div>;
};
/**
 *
 * @example <AboxProcessSubProcessesTab />
 */
class AboxProcessSubProcessesTab extends PureComponent<Object, Object> {
    static propTypes = {
        details: PropTypes.object,
        children: PropTypes.array,
        isLoading: PropTypes.bool,
        childrenLoading: PropTypes.bool,
    };

    static defaultProps = {
        details: {},
        isLoading: false,
        children: [],
        childrenLoading: false,
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
            { header: 'Assignee', field: 'createdBy', bodyComponent: AssigneeAvatarRenderer, style: { width: '100px', textAlign: 'center' } },
            { header: 'Priority', field: 'variables.priority', bodyComponent: PriorityRenderer, style: { width: '100px', textAlign: 'center' } },
            { header: 'Modified', field: 'status.lastUpdate', type: 'date', style: { width: '160px' } }, // No specs
            { header: 'Created', field: 'createDate', type: 'date', style: { width: '160px' } },
            { header: 'Closed', field: 'endDate', type: 'date', style: { width: '160px' } },
            { header: 'Duration', field: '__duration__', bodyComponent: DurationRenderer, style: { width: '160px' } },
        ].map(column => ({ ...column, filter: false, sortable: false }));
    }

    /**
     * componentDidMount - description
     *
     * @return {type}  description
     */
    componentDidMount() {
        const { details: { id }, children } = this.props;
        if (!children || !children.length) {
            this.props.loadSubprocesses(id);
        }
    }

    /**
     * @override
     */
    render(): Object {
        const { isLoading, childrenLoading, children } = this.props;
        if (isLoading || childrenLoading) {
            return <Loader absolute />;
        }
        return (
            <ContentArea>
                <DataTableClient
                    columnDefinitions={this.columnDefinitions}
                    value={children || []}
                    isLoading={childrenLoading}
                    disableCountdown={true}
                    totalRecords={(children && children.length) || 0}
                />
            </ContentArea>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.abox.process.details.isLoading,
        details: state.abox.process.details.data,
        children: state.abox.process.children.data,
        childrenLoading: state.abox.process.children.isLoading,
    }),
    {
        loadSubprocesses,
    }
)(AboxProcessSubProcessesTab);

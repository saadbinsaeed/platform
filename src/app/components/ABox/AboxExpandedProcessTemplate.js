/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Loader from 'app/components/atoms/Loader/Loader';
import DataTableClient from 'app/components/molecules/DataTable/DataTableClient/DataTableClient';
import TaskLinkRenderer from 'app/components/molecules/Grid/Renderers/Link/TaskLinkRenderer';
import Text from 'app/components/atoms/Text/Text';
import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import PriorityRenderer from 'app/components/molecules/Grid/Renderers/Priority/PriorityRenderer';
import ProgressRenderer from 'app/components/molecules/Grid/Renderers/Progress/ProgressRenderer';

const TaskStatus = styled(Text)`
font-weight: 400;
text-transform: capitalize;
`;

class AboxExpandedProcessTemplate extends PureComponent<Object, Object> {
    /**
     * @const propTypes - describes the properties of the component
     * @const defaultProps - define the defaults values of the properties
     * @const columnDefinitions -definition for columns that we need to display in our grid
     */
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
    };

    columnDefinitions: Array<Object>;
    loaderWrapperStyle = { width: '50px', paddingTop: '5px' };

    /**
     * @param {Object} props - component's properties
     */
    constructor(props: Object) {
        super(props);
        this.columnDefinitions = [
            {
                header: 'Task ID',
                field: 'id',
                bodyComponent: TaskLinkRenderer,
            },
            {
                header: 'Task Name',
                field: 'name',
                bodyComponent: TaskLinkRenderer,
            },
            {
                header: 'Description',
                field: 'description',
            },
            {
                header: 'Assignee',
                field: 'assignee.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: { idProperty: 'assignee.id', imageProperty: 'assignee.image', nameProperty: 'assignee.name' },
            },
            {
                header: 'Progress',
                field: 'variable.completion',
                style: {  textAlign: 'center', width: '100px' },
                bodyComponent: ProgressRenderer,
            },
            {
                header: 'Priority',
                field: 'priority',
                bodyComponent: PriorityRenderer,
                style: { textAlign: 'center', width: '100px' }
            },
            {
                header: 'Due',
                field: 'dueDate',
                type: 'date',
            },
            {
                header: 'Created',
                field: 'startDate',
                type: 'date',
            },
            {
                header: 'Comments',
                field: 'comments',
                renderValue: ({ value }) => (value && value.length) || 0,
            },
            {
                header: 'Status',
                field: 'variable.taskStatus.status',
                bodyComponent: ({ value }) => <TaskStatus>{value}</TaskStatus>,
            },
        ].map(column => ({ ...column, filter: false }));
    }

    /**
     * @override
     */
    render(): Object {
        return (
            this.props.isLoading ?
                <div style={this.loaderWrapperStyle}> <Loader radius="20" /> </div>:
                <DataTableClient
                    columnDefinitions={this.columnDefinitions}
                    value={this.props.data || []}
                    loading={this.props.isLoading}
                />
        );
    }
}

export default AboxExpandedProcessTemplate;

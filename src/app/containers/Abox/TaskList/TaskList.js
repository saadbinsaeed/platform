/* @flow */

import React from 'react';
import styled from 'styled-components';

import TasksView from 'app/components/organisms/TasksView/TasksView';
import PageTemplate from 'app/components/templates/PageTemplate';

const LayoutStyled = styled(TasksView)`
    grid-area: pContent;
`;

const TaskList = () => (
    <PageTemplate title="Tasks" overflowHidden={true} >
        <LayoutStyled
            FiltersProps={{ id: 'TaskListFilters' }}
        />
    </PageTemplate>
);

export default TaskList;

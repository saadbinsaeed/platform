/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation updateTaskMutation($record: TaskUpdateInput!) {
        updateTask(record: $record)
    }
`;

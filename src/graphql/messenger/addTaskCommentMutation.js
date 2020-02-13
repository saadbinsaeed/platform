/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation addTaskCommentMutation($taskId: String!, $message: String!, $plainMessage: String!) {
        addTaskComment(taskId: $taskId, message: $message, plainMessage: $plainMessage)
    }
`;

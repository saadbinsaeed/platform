/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation addProcessCommentMutation($processId: String!, $message: String!, $plainMessage: String!) {
        addProcessComment(processId: $processId, message: $message, plainMessage: $plainMessage)
    }
`;

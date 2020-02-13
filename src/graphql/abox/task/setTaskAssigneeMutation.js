/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation setTaskAssigneeMutation($id: String!, $assignee: UserReferenceInput) {
        setTaskAssignee(id: $id, assignee: $assignee)
    }
`;

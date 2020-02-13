/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation closeTaskMutation($id: String!) {
        closeTask(id: $id)
    }
`;

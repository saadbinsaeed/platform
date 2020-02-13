/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation deleteGroupMutation($id: Int!) {
        result: deleteGroup(id: $id)
    }
`;

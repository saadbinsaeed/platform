/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation deleteGroupUserMutation($id: Int!) {
        result: deleteGroupUser(id: $id)
    }
`;

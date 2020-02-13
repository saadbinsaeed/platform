/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation deleteGroupEntityMutation($id: Int!) {
        result: deleteGroupEntity(id: $id)
    }
`;

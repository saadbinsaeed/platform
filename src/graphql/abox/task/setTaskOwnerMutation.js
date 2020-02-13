/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation setTaskOwnerMutation($id: String!, $owner: UserReferenceInput) {
        setTaskOwner(id: $id, owner: $owner)
    }
`;

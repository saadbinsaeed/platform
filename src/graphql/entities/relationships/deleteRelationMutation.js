/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation deleteRelationMutation($id: Int!) {
    payload: deleteRelation(id: $id)
}
`;

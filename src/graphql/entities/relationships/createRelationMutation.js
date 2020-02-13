/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation createRelationMutation($record: RelationCreateInput!) {
        payload: createRelation(record: $record) {
            id
        }
    }
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation updateRelationMutation($record: RelationUpdateInput!) {
        payload: updateRelation(record: $record) {
            id
        }
    }
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation saveRelationMutation($relation: JSON!) {
  saveRelation(record: $relation)
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation addEntitiesToGroupMutation($groupId: Int!, $entities: [EntityReferenceInput]!) {
  addEntitiesToGroup(groupId: $groupId, entities: $entities)
}
`;

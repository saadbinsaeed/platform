/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation addUsersToGroupMutation($groupId: Int!, $userIds: [Int]!) {
  addUsersToGroup(groupId: $groupId, userIds: $userIds)
}
`;

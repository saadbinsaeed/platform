/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation updatePermissionsMutation($groupId: Int!, $groupEntityIds: [Int]!, $permissions: [String]) {
  updatePermissions(groupId: $groupId, groupEntityIds: $groupEntityIds, permissions: $permissions)
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
query taskMemberAutocompleteQuery($taskId: String!, $page: Int, $pageSize: Int, $filterBy: [JSON], $orderBy: [JSON]) {
  result: taskSelectableMembers(taskId: $taskId, page: $page, itemsPerPage: $pageSize, filterBy: $filterBy, orderBy: $orderBy) {
    id
    login
    name
  }
}
`;

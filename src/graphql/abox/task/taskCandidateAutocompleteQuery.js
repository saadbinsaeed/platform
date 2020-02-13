/* @flow */

import gql from 'graphql-tag';

export default gql`
query taskCandidateAutocompleteQuery($taskId: String!, $page: Int, $pageSize: Int, $filterBy: [JSON], $orderBy: [JSON]) {
  result: taskCandidates(taskId: $taskId, page: $page, itemsPerPage: $pageSize, filterBy: $filterBy, orderBy: $orderBy) {
    id
    login
    name
  }
}
`;

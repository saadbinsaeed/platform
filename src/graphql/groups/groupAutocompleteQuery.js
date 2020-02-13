/* @flow */

import gql from 'graphql-tag';

export default gql`
query groupAutocompleteQuery($page: Int, $pageSize: Int, $filterBy: [JSON], $orderBy: [JSON]) {
  result: groups(page: $page, itemsPerPage: $pageSize, filterBy: $filterBy, orderBy: $orderBy) {
    id
    name
  }
}
`;

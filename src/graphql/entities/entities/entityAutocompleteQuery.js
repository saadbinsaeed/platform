/* @flow */

import gql from 'graphql-tag';

export default gql`
query entityAutocompleteQuery($page: Int, $pageSize: Int, $filterBy: [JSON], $orderBy: [JSON]) {
  result: entities(page: $page, itemsPerPage: $pageSize, filterBy: $filterBy, orderBy: $orderBy) {
    id
    name
  }
}
`;

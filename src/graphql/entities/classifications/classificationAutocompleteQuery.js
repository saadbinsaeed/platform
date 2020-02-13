/* @flow */

import gql from 'graphql-tag';

export default gql`
query classificationAutocompleteQuery($page: Int, $pageSize: Int, $filterBy: [JSON], $orderBy: [JSON]) {
  result: classifications(page: $page, itemsPerPage: $pageSize, filterBy: $filterBy, orderBy: $orderBy) {
    id
    name
    uri
    color
  }
}
`;

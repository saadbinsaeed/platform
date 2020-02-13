/* @flow */

import gql from 'graphql-tag';

export default gql`
query organisationsAutocompleteDeprecatedQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON]) {
  result: organisations(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
    id
    name
  }
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
query peopleAutocompleteDeprecatedQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON]) {
  result: people(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
    id
    name
  }
}
`;

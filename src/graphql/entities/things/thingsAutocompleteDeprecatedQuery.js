/* @flow */

import gql from 'graphql-tag';

export default gql`
query thingsAutocompleteDeprecatedQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON]) {
  result: things(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
    id
    name
  }
}
`;

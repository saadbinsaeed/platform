/* @flow */

import gql from 'graphql-tag';

export default gql`
query groupUsersAddQuery($page: Int, $pageSize: Int, $where: [JSON], $excludeBy: [JSON], $orderBy: [JSON], $countMax: Int) {
  count: count(entity: "user", filterBy: $where, excludeBy: $excludeBy, max: $countMax)
  records: users(page: $page, itemsPerPage: $pageSize, filterBy: $where, excludeBy: $excludeBy, orderBy: $orderBy) {
    id
    name
    login
    active
    person {
      relationships {
        organisation1 {
          id
          name
        }
        organisation2 {
          id
          name
        }
      }
    }
  }
}
`;

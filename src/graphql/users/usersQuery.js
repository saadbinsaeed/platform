/* @flow */

import gql from 'graphql-tag';

export default gql`
query usersQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
  count: count(entity: "user", filterBy: $where, max: $countMax)
  records: users(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
    name
    login
    partyId
    image
    groups {
      name
      id
    }
    createdDate
    active
    userStatus
    lastUpdatedDate
    relations {
      id
      organisation2 {
        name
        id
      }
      relationDefinition {
        id
      }
    }
  }
}

`;

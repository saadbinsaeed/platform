/* @flow */

import gql from 'graphql-tag';

export default gql`
query broadcastsQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
  count: count(entity: "broadcast", filterBy: $where, max: $countMax)
  records: broadcasts(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
    id
    message
    readStatus
    parent {
      id
    }
    active
    startDate
    expireDate
    users {
      login
    }
    groups {
      users {
        login
      }
    }
  }
}

`;

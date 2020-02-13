/* @flow */

import gql from 'graphql-tag';

export default gql`
query broadcastsCalendarQuery($where: [JSON], $orderBy: [JSON]) {
  result: broadcasts(filterBy: $where, orderBy: $orderBy) {
    id
    message
    readStatus
    startDate
    expireDate
  }
}
`;

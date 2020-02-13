/* @flow */

import gql from 'graphql-tag';

export default gql`
query organisationsSelectQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON]) {
      records: organisations(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
        id
        name
      }
    }
`;

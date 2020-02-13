/* @flow */

import gql from 'graphql-tag';

export default gql`
query groupsSelectQuery($page: Int = 1, $pageSize: Int = 10, $where: [JSON], $orderBy: [JSON]) {
    records: groups(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
        id
        name
    }
}
`;

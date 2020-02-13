/* @flow */

import gql from 'graphql-tag';

export default gql`
    query groupUsersQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
        count: count(entity: "groupUser", filterBy: $where, max: $countMax)
        records: groupUsers(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
            id
            user {
                id
                name
                login
                active
            }
        }
    }
`;

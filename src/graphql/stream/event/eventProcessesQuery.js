/* @flow */

import gql from 'graphql-tag';

export default gql`
query eventProcessesQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON]) {
    list: processes(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
        id
        createDate
        name
        createdBy {
            name
        }
    }
}
`;

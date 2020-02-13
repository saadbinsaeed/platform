/* @flow */

import gql from 'graphql-tag';

export default gql`
query groupPermissionsQuery($page: Int, $pageSize: Int, $where: [JSON]) {
    records: groupPermissions(page: $page, itemsPerPage: $pageSize, filterBy: $where) {
        name
        displayName
        description
        parent {
            name
        }
    }
}
`;

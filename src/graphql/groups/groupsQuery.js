/* @flow */

import gql from 'graphql-tag';

export default gql`
query groupsQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON]) {
    records: groups(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
        id
        name
        category
        active
        createdDate
        modifiedDate
        createdBy {
            id
            name
            image
        }
        modifiedBy {
            id
            name
            image
        }
        parent {
            id
        }
        _usersCount
        _classificationsCount
        _entitiesCount
        _processDefinitionsCount
    }
}
`;

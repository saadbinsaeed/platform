/* @flow */

import gql from 'graphql-tag';

export default gql`
query groupEntitiesClassificationsQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON]) {
    count: count(
        entity: "groupEntity",
        filterBy: $where,
    )
    records: groupEntities(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
        id
        permissions
        classification {
            id
            name
            uri
            active
            applicableOn
            parents {
                name
            }
        }
    }
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
query entitiesQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
    count: count(entity: "entity", filterBy: $where, max: $countMax)
    records: entities(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
        id
        name
        image
        type
        active
        classes {
            id
            name
            uri
            color
        }
    }
}
`;

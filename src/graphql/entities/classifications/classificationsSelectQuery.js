/* @flow */

import gql from 'graphql-tag';

export default gql`
query classificationsSelectQuery($page: Int, $itemsPerPage: Int, $filterBy: [JSON], $orderBy: [JSON]) {
    records: classifications(page: $page, itemsPerPage: $itemsPerPage, filterBy: $filterBy, orderBy: $orderBy) {
        id
        name
        uri
     }
}
`;

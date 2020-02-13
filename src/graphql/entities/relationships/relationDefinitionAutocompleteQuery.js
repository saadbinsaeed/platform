/* @flow */

import gql from 'graphql-tag';

export default gql`
    query relationDefinitionAutocompleteQuery($page: Int, $pageSize: Int, $filterBy: [JSON], $orderBy: [JSON]) {
        result: relationDefinitions(page: $page, itemsPerPage: $pageSize, filterBy: $filterBy, orderBy: $orderBy) {
            id
            relation
            reverseRelation
            entityType1
            entityType2
            classification {
                id
            }
        }
    }
`;

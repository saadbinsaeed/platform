/* @flow */

import gql from 'graphql-tag';

export default gql`
    query tenantsQuery($filterBy: [JSON], $orderBy: [JSON]) {
        result: organisations(filterBy: $filterBy, orderBy: $orderBy) {
            id
            name
        }
    }
`;

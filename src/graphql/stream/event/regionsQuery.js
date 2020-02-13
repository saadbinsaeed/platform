/* @flow */

import gql from 'graphql-tag';

export default gql`
    query regionsQuery($filterBy: [JSON], $orderBy: [JSON]) {
        result: customEntities(filterBy: $filterBy, orderBy: $orderBy) {
            id
            name
        }
    }
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
    query vtrQuery($filterBy: [JSON]) {
        result: classifications(filterBy: $filterBy) {
            uri
        }
    }
`;

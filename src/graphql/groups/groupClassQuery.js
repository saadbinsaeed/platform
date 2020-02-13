/* @flow */

import gql from 'graphql-tag';

export default gql`query groupClassQuery($filterBy: [JSON]) {
    result: classifications(filterBy: $filterBy) {
        id
        name
        uri
        color
        formDefinitions
        abstract
        active
    }
}
`;

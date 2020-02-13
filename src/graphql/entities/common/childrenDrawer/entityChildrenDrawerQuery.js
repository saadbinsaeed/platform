/* @flow */

import gql from 'graphql-tag';

export default gql`
query entityChildrenDrawerQuery($id: Int, $filterBy: [JSON!]) {
    entity(id: $id) {
        id
        name
        image
        parent {
            id
        }
    }
    entities(filterBy: $filterBy) {
        id
        name
        image
        modifiedDate
        classes {
            id
            name
            uri
            color
        }
    }
}
`;

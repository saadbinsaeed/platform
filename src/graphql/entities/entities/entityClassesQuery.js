/* @flow */

import gql from 'graphql-tag';

export default gql`
query entityClassesQuery($id: Int) {
    entity(id: $id) {
        classes {
            uri
        }
    }
}
`;

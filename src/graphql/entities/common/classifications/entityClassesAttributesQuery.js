/* @flow */

import gql from 'graphql-tag';

export default gql`
query entityClassesAttributesQuery($id: Int!) {
    result: entity(id: $id) {
        classes(recursive: true) {
            id
            name
            active
            uri
            color
            formDefinitions
            inherited
            children {
                id
                name
            }
        }
        attributes
        entityPermissions: _permissions
    }
}
`;

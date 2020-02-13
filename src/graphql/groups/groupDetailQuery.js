/* @flow */

import gql from 'graphql-tag';

export default gql`
    query groupDetailQuery($id: Int) {
        group: group(id: $id) {
            id
            name
            category
            attributes
            classifications {
                id
                name
                uri
            }
            parent {
                id
                name
            }
            active
            createdBy {
                name
                image
                id
            }
            createdDate
            modifiedBy {
                name
                image
                id
            }
            modifiedDate
            permissions
        }
    }
`;

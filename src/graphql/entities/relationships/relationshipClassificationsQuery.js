/* @flow */

import gql from 'graphql-tag';

export default gql`
    query relationshipClassificationsQuery($id: Int!) {
        result: classification(id: $id) {
            id
            name
            active
            uri
            color
            formDefinitions
            parents {
                id
                name
                active
                uri
                color
                formDefinitions
            }
        }
    }
`;

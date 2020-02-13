/* @flow */

import gql from 'graphql-tag';

export default gql`
    query classificationDetailQuery($id: Int) {
        result: classification(id: $id) {
            id
            uri
            name
            dataOwner {
                id
                name
                login
            }
            abstract
            active
            color
            applicableOn
            parents {
                id
                uri
            }
            createdBy {
                name
                image
                id
            }
            createdDate
            modifiedDate
            modifiedBy {
                name
                image
                id
            }
            formDefinitions
        }
    }
`;

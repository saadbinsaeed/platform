/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation updateClassificationMutation($classification: ClassificationUpdateInput!) {
        result: updateClassification(record: $classification) {
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

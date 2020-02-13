/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation createClassificationMutation($classification: ClassificationCreateInput!) {
        result: createClassification(record: $classification) {
            id
        }
    }
`;

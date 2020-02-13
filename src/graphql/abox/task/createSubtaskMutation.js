/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation createSubtaskMutation($record: JSON!) {
        result: createSubtask(record: $record) {
            id
            name
        }
    }
`;

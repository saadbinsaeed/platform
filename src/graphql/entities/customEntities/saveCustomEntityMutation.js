/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation saveCustomEntityMutation($record: JSON!) {
    result: saveCustomEntity(record: $record)
}
`;

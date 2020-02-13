/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation saveEntityMutation($record: JSON!) {
    saveEntity(record: $record)
}
`;

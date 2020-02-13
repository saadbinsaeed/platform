/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation savePersonMutation($record: JSON!) {
    result: savePerson(record: $record)
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation saveUserMutation($record: JSON!) {
    result: saveUser(record: $record)
}
`;

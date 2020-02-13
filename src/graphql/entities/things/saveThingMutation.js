/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation saveThingMutation($record: JSON!) {
    result: saveThing(record: $record)
}
`;

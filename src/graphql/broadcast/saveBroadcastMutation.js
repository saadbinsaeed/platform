/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation saveBroadcastMutation($record: BroadcastInput!) {
    saveBroadcast(record: $record)
}
`;

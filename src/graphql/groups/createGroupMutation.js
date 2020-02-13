/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation createGroupMutation($record: GroupCreateInput!) {
    result: createGroup(record: $record) {
        id
        name
    }
}
`;

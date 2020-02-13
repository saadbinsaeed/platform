/* @flow */

import gql from 'graphql-tag';

export default gql`
query broadcastQuery($id: Int) {
    result: broadcast(id: $id) {
        id
        message
        active
        startDate
        users {
            id
            login
            name
        }
        groups {
            id
            name
        }
        expiresAfterValue
        expiresAfterUnit
        repeat
        repeatInterval
        repeatValue
        repeatEnds
    }
}
`;

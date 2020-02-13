/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation readBroadcastMutation($id: Int!) {
    readBroadcast(id: $id)
}
`;

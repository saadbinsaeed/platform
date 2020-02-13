/* @flow */

import gql from 'graphql-tag';

export default gql`
query activeBroadcastsQuery {
  broadcasts: activeBroadcasts {
      broadcast {
          id
          message
          priority
          actionData
          actionType
      }
  }
}
`;

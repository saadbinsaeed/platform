/* @flow */

import gql from 'graphql-tag';

export default gql`
query notificationsQuery {
  tasks: lastMinuteActiveTasks {
    id
    name
    description
    assignee {
      login
    }
    owner {
      login
    }
  }
  broadcasts: activeBroadcasts {
    broadcast {
      id
      message
      priority
      actionType
      actionData
    }
  }
}
`;

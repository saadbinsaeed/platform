/* @flow */

import gql from 'graphql-tag';

export default gql`
query widgetTasksInvolvementQuery($assignee: [JSON], $owner: [JSON], $teamMember: [JSON]) {
  assignee: count(entity: "task", filterBy: $assignee)
  owner: count(entity: "task", filterBy: $owner)
  teamMember: count(entity: "task", filterBy: $teamMember)
}
`;
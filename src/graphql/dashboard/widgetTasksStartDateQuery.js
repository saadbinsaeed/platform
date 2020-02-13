/* @flow */

import gql from 'graphql-tag';

export default gql`
query widgetTasksStartDateQuery($passed: [JSON], $today: [JSON], $upcoming: [JSON], $notSet: [JSON]) {
  passed: count(entity: "task", filterBy: $passed)
  today: count(entity: "task", filterBy: $today)
  upcoming: count(entity: "task", filterBy: $upcoming)
  notSet: count(entity: "task", filterBy: $notSet)
}
`;
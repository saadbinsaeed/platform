/* @flow */

import gql from 'graphql-tag';

export default gql`
query widgetTasksDueDateQuery($overDue: [JSON], $today: [JSON], $upcoming: [JSON], $notSet: [JSON]) {
  overdue: count(entity: "task", filterBy: $overDue)
  today: count(entity: "task", filterBy: $today)
  upcoming: count(entity: "task", filterBy: $upcoming)
  notSet: count(entity: "task", filterBy: $notSet)
}
`;


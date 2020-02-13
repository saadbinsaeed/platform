// @flow

import gql from 'graphql-tag';

export default gql`
query tasksCalendarQuery($filterBy: [JSON], $orderBy: [JSON]) {
  records: tasks(filterBy: $filterBy, orderBy: $orderBy) {
    id
    priority
    dueDate
    endDate
    name
    bpmnVariables {
      name
      type
      text
    }
  }
}
`;

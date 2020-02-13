// @flow

import gql from 'graphql-tag';

export default gql`
query tasksTimelineQuery($filterBy: [JSON], $orderBy: [JSON]) {
  count: count(entity: "task", filterBy: $filterBy)
  records: tasks(filterBy: $filterBy, orderBy: $orderBy) {
    id
    name
    description
    assignee {
      id
      login
      image
      name
    }
    priority
    dueDate
    startDate
    endDate
    parent {
      id
    }
    variable {
      completion
    }
    bpmnVariables {
      name
      type
      text
      text2
      long
      double
      bytearrayId
    }
    _childrenCount
    relationships {
      id
      relationDefinition {
        id
        relation
        entityType1
      }
      task1 {
        id
        name
      }
      task2 {
        id
        name
        dueDate
      }
    }
  }
}
`;

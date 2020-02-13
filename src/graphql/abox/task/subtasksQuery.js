/* @flow */

import gql from 'graphql-tag';

export default gql`
query subtasksQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
  count: count(entity: "task", , filterBy: $filterBy)
  records: tasks(startIndex: $startIndex, stopIndex: $stopIndex, filterBy: $filterBy, orderBy: $orderBy) {
      id
      name
      description
      priority
      startDate
      endDate
      variable {
          completion
      }
      comments {
          id
      }      
      _attachmentsCount
      _childrenCount
      assignee {
          login
          image
          name
      }
  }
}`;

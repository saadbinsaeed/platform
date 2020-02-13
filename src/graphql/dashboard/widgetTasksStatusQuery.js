/* @flow */

import gql from 'graphql-tag';

export default gql`
query widgetTasksStatusQuery($open: [JSON], $closed: [JSON]) {
  open: count(entity: "task", filterBy: $open)
  closed: count(entity: "task", filterBy: $closed)
}
`;
      
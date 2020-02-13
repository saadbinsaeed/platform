/* @flow */

import gql from 'graphql-tag';

export default gql`
query widgetTasksByGroupQuery($filterBy: [JSON], $groupBy: [JSON]) {
  result: select(entity: "task", filterBy: $filterBy, groupBy: $groupBy)
}
`;
      
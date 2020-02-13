/* @flow */

import gql from 'graphql-tag';

export default gql`
query translationRuleQuery($filterBy: [JSON], $groupBy: [JSON], $orderBy: [JSON]) {
  result: select(entity: "customEntity", filterBy: $filterBy, groupBy: $groupBy, orderBy: $orderBy)
}
`;

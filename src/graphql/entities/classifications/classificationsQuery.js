/* @flow */

import gql from 'graphql-tag';

export default gql`
query classificationsQuery($page: Int, $pageSize: Int, $where: [JSON], $excludeBy: [JSON], $orderBy: [JSON], $countMax: Int) {
  count: count(entity: "classification", filterBy: $where, excludeBy: $excludeBy, max: $countMax)
  records: classifications(page: $page, itemsPerPage: $pageSize, filterBy: $where, excludeBy: $excludeBy, orderBy: $orderBy) {
    id
    uri
    name
    active
    abstract
    createdBy {
      id
      name
      image
    }
    createdDate
    modifiedBy {
      id
      name
      image
    }
    modifiedDate
    applicableOn
  }
}
`;

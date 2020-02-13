/* @flow */

import gql from 'graphql-tag';

export default gql`
query designerFormListQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
    count: count(entity: "formDefinition", filterBy: $filterBy)
    records: formDefinitions(startIndex: $startIndex, stopIndex: $stopIndex, filterBy: $filterBy, orderBy: $orderBy) {
        id
        name
        description
        version
        modified
        created
        createdBy {
            id
            name
        }
        modifiedBy {
            id
            name
        }
        share {
            id
            permission
            user{
              id
              name
              login
            }
        }
  }
}
`;

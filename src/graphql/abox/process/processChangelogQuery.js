
import gql from 'graphql-tag';

export default gql`
query processChangelogQuery($id: String!, $orderBy: [JSON], $filterBy: [JSON], $startIndex: Int, $stopIndex: Int) {
  process(id: $id) {
    changelog(orderBy: $orderBy, filterBy: $filterBy, startIndex: $startIndex, stopIndex: $stopIndex) {
      id
      modifiedBy {
        id
        name
        image
      }
      modifiedDate
      changes
    }
  },
  count: countChangelog(id:$id, type: "process", filterBy: $filterBy)
}
`;

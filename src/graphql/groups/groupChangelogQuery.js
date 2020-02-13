
import gql from 'graphql-tag';

export default gql`
query groupChangelogQuery($id: Int!,  $uid: String!, $orderBy: [JSON], $filterBy: [JSON], $startIndex: Int, $stopIndex: Int) {
  group(id: $id) {
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
  count: countChangelog(id:$uid, type: "group", filterBy: $filterBy)
}
`;

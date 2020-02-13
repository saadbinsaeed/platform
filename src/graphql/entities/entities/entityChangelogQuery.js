
import gql from 'graphql-tag';

export default gql`
query entityChangelogQuery($id: Int!, $textId:String!, $orderBy: [JSON], $filterBy: [JSON], $startIndex: Int, $stopIndex: Int) {
  entity(id: $id) {
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
  count: countChangelog(id:$textId, type: "entity", filterBy: $filterBy)
}
`;

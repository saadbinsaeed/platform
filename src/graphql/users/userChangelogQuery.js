
import gql from 'graphql-tag';

export default gql`
query userChangelogQuery($reference: UserReferenceInput!, $id: String!, $orderBy: [JSON], $filterBy: [JSON], $startIndex: Int, $stopIndex: Int) {
  userByReference(reference: $reference) {
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
  count: countChangelog(id:$id, type: "entity", filterBy: $filterBy)
}
`;

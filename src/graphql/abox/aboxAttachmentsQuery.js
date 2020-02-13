/* @flow */

import gql from 'graphql-tag';

export default gql`
query aboxAttachmentsQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
  count: count(entity: "attachment", , filterBy: $filterBy)
  records: attachments(startIndex: $startIndex, stopIndex: $stopIndex, filterBy: $filterBy, orderBy: $orderBy) {
    id
    name
    createdBy {
      id
      name
      image
      login
    }
    createDate
    modifiedBy {
      id
      name
      image
      login
    }
    modifiedDate
    mimeType
    size
  }
}`;

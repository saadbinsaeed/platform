/* @flow */

import gql from 'graphql-tag';

export default ({ entity, countType }: Object) => gql`
query attachmentsQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
    count: count(entity: "${countType}", filterBy: $filterBy)
    records: ${entity}(startIndex: $startIndex, stopIndex: $stopIndex,filterBy: $filterBy, orderBy: $orderBy) {
        id
        url
        name
        createdDate
        createdBy {
            login
        }
        mimeType
        size
    }
}
`;

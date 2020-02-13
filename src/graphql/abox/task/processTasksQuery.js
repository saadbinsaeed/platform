/* @flow */

import gql from 'graphql-tag';

export default gql`
query processTasksQuery($startIndex: Int, $stopIndex: Int, $page: Int, $itemsPerPage: Int, $filterBy: [JSON], $orderBy: [JSON]) {
    result: tasks(startIndex: $startIndex, stopIndex: $stopIndex, page: $page, itemsPerPage: $itemsPerPage, filterBy: $filterBy, orderBy: $orderBy) {
        id
        name
        assignee {
            id
            name
            image
        }
        startDate
        endDate
        priority
        variable {
            completion
        }
    }
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
query processExpandTasksQuery($startIndex: Int, $stopIndex: Int, $page: Int, $itemsPerPage: Int, $filterBy: [JSON], $orderBy: [JSON]) {
    tasks(startIndex: $startIndex, stopIndex: $stopIndex, page: $page, itemsPerPage: $itemsPerPage, filterBy: $filterBy, orderBy: $orderBy) {
        id
        name
        assignee {
            id
            name
            image
            login
        }
        startDate
        comments {
            id
        }
        description
        endDate
        dueDate
        priority
        variable {
            completion
            taskStatus {
                status
            }
        }
    }
}
`;

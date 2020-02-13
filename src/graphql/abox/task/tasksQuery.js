/* @flow */

import gql from 'graphql-tag';

export default gql`
query tasksQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
    count: count(entity: "task", filterBy: $filterBy)
    records: tasks(startIndex: $startIndex, stopIndex: $stopIndex, filterBy: $filterBy, orderBy: $orderBy) {
    id
    priority
    dueDate
    endDate
    owner {
        id
        name
        login
    }
    teamMembers {
        user {
            login
        }
    }
    taskStatus {
        lastUpdate
    }
    name
    assignee {
        login
        name
        image
    }
    comments {
        id
        createDate
        message
    }
    _attachmentsCount
    _childrenCount
    description
    variable {
        completion
        isRead
        taskStatus {
            status
                category
            }
        }
    }
}
`;

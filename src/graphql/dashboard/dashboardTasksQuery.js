/* @flow */

import gql from 'graphql-tag';

export default gql`
    query dashboardTasksQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
        count: count(entity: "task", filterBy: $filterBy)
        records: tasks(startIndex: $startIndex, stopIndex: $stopIndex, filterBy: $filterBy, orderBy: $orderBy) {
            id
            priority
            startDate
            endDate
            dueDate
            name
            assignee {
                id
                name
                login
            }
            owner {
                id
                name
            }
            teamMembers {
                user {
                    id
                    name
                }
            }
            comments {
                id
                createDate
                message
            }
            variable {
                completion
            }
            bpmnVariables {
                name
                type
                bytearrayId
                text
                double
                long
                text2
            }
            taskStatus {
                lastUpdate
            }
            process {
                processDefinition {
                    name
                }
            }
        }
    }
`;

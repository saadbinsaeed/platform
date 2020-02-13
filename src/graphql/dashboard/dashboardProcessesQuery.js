/* @flow */

import gql from 'graphql-tag';

export default gql`
    query dashboardProcessesQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
        count: count(entity: "process", filterBy: $filterBy)
        records: processes(startIndex: $startIndex, stopIndex: $stopIndex, filterBy: $filterBy, orderBy: $orderBy) {
            id
            name
            businessKey
            comments {
                id
                createDate
                message
                createdBy {
                    id
                    login
                    image
                    name
                }
            }
            attachments {
                id
            }
            teamMembers {
                id
            }
            tasks {
                id
            }
            endDate
            createDate
            variables(fields: ["progress", "priority"])
            createdBy {
                id
                login
                name
                image
            }
            status {
                payload(fields: ["maintenancesite.region"])                
            }
        }
    }
`;

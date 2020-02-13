/* @flow */

import gql from 'graphql-tag';

export default gql`
    query subprocessesQuery($page: Int = 1, $itemsPerPage: Int = 10, $filterBy: [JSON] = []) {
        result: processes(page: $page, itemsPerPage: $itemsPerPage, filterBy: $filterBy) {
            id
            name
            endDate
            createdBy {
                id
                image
                login
                name
            }
            createDate
            processDefinition {
                deployedModel {
                    modelData(fields: ["icon", "iconColor"])
                }
            }
            variables(fields: ["progress", "priority"])
            status {
                lastUpdate
            }
        }
    }
`;

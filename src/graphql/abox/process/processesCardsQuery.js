/* @flow */

import gql from 'graphql-tag';

export default gql`
    query processesCardsQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
        count: count(entity: "process", filterBy: $filterBy)
        records: processes(startIndex: $startIndex, stopIndex: $stopIndex, filterBy: $filterBy, orderBy: $orderBy) {
            id
            name
            processDefinition {
                name
                deployedModel {
                    modelData(fields: ["icon", "iconColor"])
                }
            }
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
                type
                user {
                    id
                    name
                    login
                    image
                }
                group {
                  id
                  name
                  users {
                    id
                    name
                    image
                    login
                    active
                  }
                }                                    
            }
            summary
            tasks {
                teamMembers {
                    id
                    type
                    user {
                        id
                        name
                        login
                        image
                    }
                    group {
                      id
                      name
                      users {
                        id
                        name
                        image
                        login
                        active
                      }
                    }
                }
                id
                priority
                assignee {
                    id
                    login
                    name
                    image
                }
                name
                variable {
                    completion
                }
                endDate
            }
            status {
                lastUpdate
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
        }
    }
`;

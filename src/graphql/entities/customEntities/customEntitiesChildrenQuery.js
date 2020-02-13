/* @flow */

import gql from 'graphql-tag';

export default gql`
    query customEntitiesChildrenQuery($filterBy: [JSON]) {
        result: customEntities(filterBy: $filterBy) {
            id
            active
            iconName
            iconColor
            parent {
                id
            }
            name
            classes {
                id
                name
                uri
                color
            }
            createdBy {
                id
                image
                name
            }
            createdDate
            modifiedBy {
                id
                image
                name
            }
            modifiedDate
            children {
                id
                parent {
                    id
                }
                name
                classes {
                    uri
                }
                createdBy {
                    name
                }
                createdDate
                modifiedBy {
                    name
                }
                modifiedDate
            }
        }
    }
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation updateGroupMutation($record: GroupUpdateInput!) {
        result: updateGroup(record: $record) {
            id
            name
            category
            attributes
            classifications {
                id
                name                
                uri
            }
            parent {
                id
                name
            }
            active
            createdBy {
                name
                image
                id
            }
            createdDate
            modifiedBy {
                name
                image
                id
            }
            modifiedDate
            permissions
        }
    }
`;

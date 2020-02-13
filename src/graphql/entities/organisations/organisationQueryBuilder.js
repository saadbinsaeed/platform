/* @flow */

import gql from 'graphql-tag';

const organisationQueryBuilder = (id: number) => gql`
    query organisationQuery($id: Int) {
        organisation: organisation(id: $id) {
            id
            partyId
            description
            name
            fullName
            active
            enableGis
            locationInfo
            modifiedDate
            createdDate
            image
            iconName
            iconColor
            contactInfo
            locationInfo
            _summary
            _permissions
            dataOwner {
                id
                login
                name
            }
            contactPerson {
                id
                login
                name
            }
            modifiedBy {
                name
            }
            createdBy {
                id
                name
                image
            }
            parent {
                id
                name
                image
            }
            classes {
                id
                uri
                name
                color
                formDefinitions
                children {
                    id
                    uri
                    name
                    color
                    formDefinitions
                }
            }
            _structure
        }
        recentAttachments: fileOrganisations(
            page: 1,
            itemsPerPage: 10,
            filterBy: [{ field: "organisation.id", op: "=", value: ${id}  }],
            orderBy: [ { field: "createdDate", direction: "asc" } ]
        ) {
            url
            name
        }
    }
`;
export default organisationQueryBuilder;

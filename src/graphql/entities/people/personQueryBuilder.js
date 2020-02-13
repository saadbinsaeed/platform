/* @flow */

import gql from 'graphql-tag';

const personQueryBuilder = (id: number) => gql`
query personQuery($id: Int) {
    person: person(id: $id ) {
        id
        name
        modifiedDate
        createdDate
        partyId
        iconName
        iconColor
        image
        dateOfBirth
        active
        enableGis
        description
        contactInfo
        locationInfo
        _summary
        _permissions
        user {
            id
        }
        dataOwner {
            id
            login
            name
        }
        createdBy {
            id
            name
            image
        }
        modifiedBy {
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
    recentAttachments: filePersons(
        page: 1,
        itemsPerPage: 10,
        filterBy: [{ field: "person.id", op: "=", value: ${id}  }],
        orderBy: [ { field: "createdDate", direction: "asc" } ]
    ) {
        url
        name
    }
}
`;

export default personQueryBuilder;

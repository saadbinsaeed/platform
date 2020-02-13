/* @flow */

import gql from 'graphql-tag';

const thingQueryBuilder = (id: number) => gql`
query thingQuery($id: Int) {
  thing:thing(id: $id) {
    id
    name
    image
    description
    dataOwner {
      id
      login
      name
    }
    classes{
      id
      uri
      name
      color
      formDefinitions
    }
    organisation {
      id
      name
    }
    parent {
      id
      name
    }
    locationInfo
    active
    enableGis
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
    thingId
    iconName
    iconColor
    _permissions
    _summary
    _structure
  }
  recentAttachments: fileThings(
    page: 1,
    itemsPerPage: 10,
    filterBy: [{ field: "thing.id", op: "=", value: ${id} }],
    orderBy: [ { field: "createdDate", direction: "asc" } ]
  ) {
    url
    name
  }
}
`;

export default thingQueryBuilder;

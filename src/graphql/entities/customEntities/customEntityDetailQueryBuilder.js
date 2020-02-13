/* @flow */

import gql from 'graphql-tag';

export default (id: number) => gql`
query customEntityDetailQuery {
  customEntity: customEntity(id: ${id}) {
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
    iconName
    iconColor
    _permissions
    _summary
    _structure
  }
  recentAttachments: fileCustomEntities(
    page: 1,
    itemsPerPage: 10,
    filterBy: [{ field: "customEntity.id", op: "=", value: ${id}}],
    orderBy: [{ field: "createdDate", direction: "asc" }]
  ) {
    url
    name
  }
}
`;

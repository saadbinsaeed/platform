/* @flow */

import gql from 'graphql-tag';

export default gql`
query thingChildrenQuery($filterBy: [JSON]) {
  result: things(filterBy: $filterBy) {
    id
    active
    iconName
    iconColor
    parent {
      id
    }
    thingId
    name
    classes {
      id
      name
      uri
      color
    }
    createdBy {
        name
        id
        image
    }
    createdDate
    modifiedBy {
        name
        id
        image
    }
    modifiedDate
    children {
        id
        parent {
          id
        }
        thingId
        name
        classes {
          uri
        }
        createdBy {
            name
            id
            image
        }
        createdDate
        modifiedBy {
            name
            id
            image
        }
        modifiedDate
    }
  }
}
`;

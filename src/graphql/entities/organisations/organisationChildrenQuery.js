/* @flow */

import gql from 'graphql-tag';

export default gql`
query organisationChildrenQuery($filterBy: [JSON]) {
  result: organisations(filterBy: $filterBy) {
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

/* @flow */

import gql from 'graphql-tag';

export default gql`
query profileQuery {
  user:profile {
    id
    login
    activitiId
    name
    email
    domain
    createdDate
    image
    apps
    role
    isAdmin
    permissions
    groups
  }
}
`;

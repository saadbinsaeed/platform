/* @flow */

import gql from 'graphql-tag';

export default gql`
query userSelectQuery {
  result: users {
    id
    login
    name
  }
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation shareFormDefinitionMutation($id: Int!, $shares: [ModelShareInput]!){
  result: shareForm(id: $id, shares: $shares) {
    id
    name
    modified
  }
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
query relationship($id:Int!) {
  result: relation(id:$id) {
    id
    relationDefinition {
      classification {
        id
      }
    }
    attributes
  }
}
`;

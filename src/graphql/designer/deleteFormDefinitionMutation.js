/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation deleteFormDefinitionMutation($id: Int!) {
  result: deleteForm(id: $id)
}

`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation cloneFormDefinitionMutation($id: Int!, $record: FormDefinitionCreateInput!){
  result: cloneForm(id: $id, record: $record) {
    id
    name
    modified
  }
}

`;

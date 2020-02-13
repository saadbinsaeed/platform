/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation createFormDefinitionMutation($record: FormDefinitionCreateInput!){
  result: createForm(record: $record) {
    id
    name
    modified
  }
}

`;

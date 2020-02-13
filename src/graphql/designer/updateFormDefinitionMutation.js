/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation updateFormDefinitionMutation($record: FormDefinitionUpdateInput!, $newVersion: Boolean, $overwriteDeployed: Boolean){
  result: updateForm(record: $record, newVersion: $newVersion, overwriteDeployed: $overwriteDeployed) {
    id
    name
    modified
  }
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
query formDefinitionQuery($id: Int!) {
  result: formDefinition(id: $id) {
    id
    name
    version
    definition(fields: ["version", "fields[*].type", "fields[*].miconfig"])
    modified
  }
}
`;

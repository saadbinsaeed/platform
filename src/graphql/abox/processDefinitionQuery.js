/* @flow */

import gql from 'graphql-tag';

export default gql`
query processDefinitionQuery($filterBy: [JSON]) {
  result: deployedProcessesDefinitions(filterBy: $filterBy) {
    id
    deployedModel {
      name
    }
    _startFormDefinition {
      id
      definition(fields: ["version", "fields[*].type", "fields[*].miconfig"])
    }
  }
}
`;

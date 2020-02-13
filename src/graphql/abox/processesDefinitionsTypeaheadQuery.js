/* @flow */

import gql from 'graphql-tag';

export default gql`
query processesDefinitionsTypeaheadQuery {
  records: deployedProcessesDefinitions {
    name
  }
}
`;

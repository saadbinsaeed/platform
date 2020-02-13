/* @flow */

import gql from 'graphql-tag';

export default gql`
query processesDefinitionsQuery {
  records: deployedProcessesDefinitions {
    description
    key
    deployedModel {
      id
      version
      name
      modelData(fields: ["icon", "iconColor"])
    }
    application {
      id
      name
      createDate
      createdBy {
        name
        login
        image
      }
      description
      version
      modifiedDate
      modifiedBy {
        name
        login
        image
        lastUpdatedDate
      }
      model(fields: ["icon", "iconColor"])
    }
  }
}
`;

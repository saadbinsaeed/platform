// @flow

import gql from 'graphql-tag';

export default gql`
query processDetailsQuery($id: String) {
  result: process(id: $id) {
    id
    name
    parent {
      id
      name
      variables(fields: ["progress", "priority"])
    }
    processDefinition {
      description
      name
      snapshot {
        bytes
      }
      deployedModel {
        modelData(fields: ["icon", "iconColor"])
      }
      application {
        name
        createdBy {
          id
          name
          image
          login
        }
      }
    }
    businessKey
    createdBy {
      id
      login
      name
      image
      createdDate
    }
    createDate
    variables(fields: ["progress", "priority", "project"])
    endDate
    summary
    teamMembers {
      id
      type
      createdDate
      user {
        id
        name
        login
        image
      }
      group {
        id
        name
        users {
          id
          name
          image
          login
          active
        }
      }
    }
    attachments {
      id
      name
      size
      mimeType
      createdBy {
        name
        image
        login
        image
      }
      createDate
      modifiedBy {
        name
        image
        login
        image
      }
      modifiedDate
    }
    comments {
      id
      createDate
      message
      createdBy {
        id
        name
        image
        login
      }
    }
    status {
      lastUpdate
      initiatedBy {
        id
        name
        processDefinition {
          name
        }
      }
    }
  }
}
`;

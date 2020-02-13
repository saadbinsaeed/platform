// @flow

import gql from 'graphql-tag';

export default gql`
query taskQuery($id: String) {
  result: task(id: $id) {
    id
    parent {
      id
      name
      variable {
        completion
      }
      endDate
      priority
    }
    name
    owner {
      id
      name
      login
      image
      createdDate
    }
    assignee {
      id
      login
      name
      image
      createdDate
    }
    variable {
      completion
      isReadByAssignee
      taskStatus {
        status
        category
      }
    }
    priority
    endDate
    startDate
    dueDate
    claimDate
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
    comments {
      id
      createDate
      message
      createdBy {
        id
        login
        image
        name
      }
    }
    attachments {
      id
      name
      size
      mimeType
    }
    description
    definitionKey
    process {
      id
      name
      processDefinition {
        snapshot {
          bytes
        }
        deployedModel {
          modelData(fields: ["icon", "iconColor", "childShapes[*].resourceId", "childShapes[*].properties.overrideid", "childShapes[*].properties.usertaskassignment.assignment.idm"])
        }
      }
      variables(fields: ["progress", "priority"])
      endDate
      bpmnVariables {
        name
        type
        text
        text2
        long
        double
        bytearrayId
      }
    }
    children {
      id
      name
      description
      priority
      startDate
      endDate
      variable {
        completion
      }
      assignee {
        id
        login
        image
        name
      }
    }
    form {
      id
      definition(fields: ["version", "fields[*].type", "fields[*].miconfig"])
    }
    bpmnVariables {
      name
      type
      text
      text2
      long
      double
      bytearrayId
    }
  }
}
`;

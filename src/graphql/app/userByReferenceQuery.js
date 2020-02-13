import gql from 'graphql-tag';

export default gql `
query userByReferenceQuery($reference: UserReferenceInput!) {
  result: userByReference(reference: $reference) {
    id
    login
    apps
    domain
    language
    partyId
    image
    uri
    role
    activitiId
    description
    createdDate
    name
    lastUpdatedDate
    active
    groups {
      id
      name
    }
    relations {
      id
    }
    createdBy {
      id
      name
    }
    person {
      id
    }
  }
}
`;

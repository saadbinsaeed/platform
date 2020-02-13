/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation saveOrganisationMutation($record: JSON!) {
    result: saveOrganisation(record: $record)
}
`;

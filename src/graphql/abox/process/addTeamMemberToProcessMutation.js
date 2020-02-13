/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation addTeamMemberToProcessMutation($id: String!, $family: MemberFamilyEnum!, $memberId: Int!) {
    addMemberToProcess(id: $id, family: $family, memberId: $memberId)
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation removeTeamMemberFromProcessMutation($id: String!, $family: MemberFamilyEnum!, $memberId: Int!) {
    removeMemberFromProcess(id: $id, family: $family, memberId: $memberId)
}
`;

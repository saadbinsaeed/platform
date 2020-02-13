/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation removeTeamMemberFromTaskMutation($id: String!, $family: MemberFamilyEnum!, $memberId: Int!) {
    removeMemberFromTask(id: $id, family: $family, memberId: $memberId)
}
`;

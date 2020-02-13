/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation addTeamMemberToTaskMutation($id: String!, $family: MemberFamilyEnum!, $memberId: Int!) {
    addMemberToTask(id: $id, family: $family, memberId: $memberId)
}
`;

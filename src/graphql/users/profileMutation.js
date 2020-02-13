/* @flow */

import gql from 'graphql-tag';

export default gql`
mutation profileMutation($profile: JSON!) {
  saveProfile(profile: $profile)
}
`;

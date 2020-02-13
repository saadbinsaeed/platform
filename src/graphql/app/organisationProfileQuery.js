/* @flow */

import gql from 'graphql-tag';

export default gql`
query organisationProfileQuery {
   organisationProfile {
    name
    image
  }
}
`;

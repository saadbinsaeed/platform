/* @flow */

import gql from 'graphql-tag';

export default gql`
    query getEntityTypeQuery($id: Int!){
        entity(id: $id) {
            type
        }
    }
`;

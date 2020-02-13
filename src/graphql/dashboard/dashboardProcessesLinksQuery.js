/* @flow */

import gql from 'graphql-tag';

export default gql`
    query dashboardProcessesQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
        records: processes(startIndex: $startIndex, stopIndex: $stopIndex, filterBy: $filterBy, orderBy: $orderBy) {
            id
            name
        }
    }
`;

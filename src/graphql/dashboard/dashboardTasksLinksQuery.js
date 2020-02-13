/* @flow */

import gql from 'graphql-tag';

export default gql`
    query dashboardTasksLinksQuery($startIndex: Int, $stopIndex: Int, $filterBy: [JSON], $orderBy: [JSON]) {
        records: tasks(startIndex: $startIndex, stopIndex: $stopIndex, filterBy: $filterBy, orderBy: $orderBy) {
            id
            name
        }
    }
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
    query peopleQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
        count: count(entity: "person", filterBy: $where, max: $countMax)
        records: people(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
            id
            name
            image
            locationInfo
            classes {
                id
                name
                color
                uri
            }
            modifiedDate
            active
            createdBy {
                id
                name
                image
            }
            _attachmentsCount
            _relationshipsCount
        }
    }
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
    query organisationsQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
        count: count(entity: "organisation", filterBy: $where, max: $countMax)
        records: organisations(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
            id
            name
            description
            _attachmentsCount
            locationInfo
            classes {
                id
                name
                color
                uri
            }
            children {
                id
                name
            }
            createdDate
            modifiedDate
            active
            image
            parent {
                id
                name
                image
            }
            modifiedBy {
                name
                image
                id
            }
            createdBy {
                id
                name
                image
            }
            _relationshipsCount
        }
    }
`;

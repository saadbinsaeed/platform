/* @flow */

import gql from 'graphql-tag';

export default gql`
    query thingsQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
        count: count(entity: "thing", filterBy: $where, max: $countMax)
        records: things(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
            id
            name
            image
            description
            thingId
            children {
                name
                id
            }
            classes {
                id
                name
                uri
                color
            }
            organisation {
                id
                name
                image
            }
            parent {
                id
                name
                image
            }
            locationInfo
            active
            createdBy {
                name
                image
                id
            }
            createdDate
            modifiedBy {
                name
                image
                id
            }
            _attachmentsCount
            _relationshipsCount
            modifiedDate
            iconName
            iconColor
        }
    }
`;

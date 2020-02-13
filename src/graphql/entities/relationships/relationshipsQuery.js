/* @flow */

import gql from 'graphql-tag';

export default gql`
query relationshipsQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
    count: count(entity: "relation", filterBy: $where, max: $countMax)
    records: relations(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
        id
        createdDate
        createdBy {
            id
            name
            image
        }
        modifiedDate
        modifiedBy {
            id
            name
            image
        }
        relationDefinition {
            id
            entityType1
            entityType2
            relation
            reverseRelation
            customEntity {
                active
            }
        }
        thing1 {
            id
            name
            image
            active
        }
        thing2 {
            id
            name
            image
            active
        }
        person1 {
            id
            name
            image
            active
        }
        person2 {
            id
            name
            image
            active
        }
        organisation1 {
            id
            name
            image
            active
        }
        organisation2 {
            id
            name
            image
            active
        }
        custom1: customEntity1 {
            id
            name
            image
            active
        }
        custom2: customEntity2 {
            id
            name
            image
            active

        }
        process1 {
            id
            name
        }
        process2 {
            id
            name
        }
        task1 {
            id
            name
        }
        task2 {
            id
            name
        }
    }
}
`;

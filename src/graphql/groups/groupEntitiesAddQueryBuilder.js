/* @flow */

import gql from 'graphql-tag';

export default ({ entity, countType }: Object) => {
    const isClasses = entity !== 'processDefinitionEntities' ? 'active classes { id name uri color }' : '';
    return gql`
        query groupsEntitiesAddQuery($page: Int, $pageSize: Int, $where: [JSON], $excludeBy: [JSON], $orderBy: [JSON], $countMax: Int) {
            count: count(entity: "${countType}", filterBy: $where, max: $countMax)
            records: ${entity}(page: $page, itemsPerPage: $pageSize, filterBy: $where, excludeBy: $excludeBy, orderBy: $orderBy) {
                id
                name
                ${isClasses}
            }
        }
    `;
};

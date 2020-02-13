import gql from 'graphql-tag';

export default gql`
    query groupOrganisationsQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
        count: count(entity: "groupEntity", filterBy: $where, max: $countMax)
        records: groupEntities(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
            id
            permissions
            organisation {
                id
                name
                active
                classes{
                    id
                    uri
                    name
                    color
                }
            }
        }
    }
`;

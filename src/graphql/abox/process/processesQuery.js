/* @flow */

import gql from 'graphql-tag';

export default gql`
query processesQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
  count: count(entity: "process", filterBy: $where, max: $countMax)
  records: processes(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
    id
    businessKey
    name
    processDefinition {
      name
      deployedModel {
        modelData(fields: ["icon"])
      }
    }
    createdBy {
      id
      name
      image
    }
    createDate
    endDate
    status {
      lastUpdate
      initiatedBy {
       id
      }
      payload(fields: ["maintenancesite.region", "maintenancesite.tenants[*].tenant_id", "maintenancesite.fse_obj.display_name", "maintenancesite.rto_obj.display_name", "maintenancesite.sfom_obj.display_name", "maintenancesite.new_ihs_id", "selectedTenants[*].tenant_id"])
    }
    tasks {
      id
    }
    variables(fields: ["progress", "priority"])
  }

}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
query eventsQuery($page: Int, $pageSize: Int, $where: [JSON], $orderBy: [JSON], $countMax: Int) {
  count: count(entity: "event", filterBy: $where, max: $countMax)
  records: events(page: $page, itemsPerPage: $pageSize, filterBy: $where, orderBy: $orderBy) {
    id,
    deviceFound,
    device {
      id
      name
      active
      thingId
      description
      modifiedDate
      active
      attributes(fields: ["Sites/tenants", "Sites/vendor", "Sites/region", "Sites/old_ihs_id"])
    },
    status,
    severity,
    description,
    eventDate,
    streamReceivedDate,
    modifiedDate,
    updatedBy {
      id
      name
      image
    },
    eventSource {
      name
    },
    sourceDevice,
    streamId,
    alarmCode,
    dataPayload( fields: [ "impact", "type" ]),
    displayPayload
    receivedDate,
    eventType {
      id
      displayExpression
      processDefinitions
    },
    processInstances {
      id
    }
  }
}
`;

/* @flow */

import gql from 'graphql-tag';

export default gql`
query widgetTasksByCommonFilterQuery($today: [JSON], $yesterday: [JSON], $lastThirtyDays: [JSON], $lastThirtyPlusDays: [JSON], $notSet: [JSON]) {
  today: count(entity: "task", filterBy: $today)
  yesterday: count(entity: "task", filterBy: $yesterday)
  lastThirtyDays: count(entity: "task", filterBy: $lastThirtyDays)
  lastThirtyPlusDays: count(entity: "task", filterBy: $lastThirtyPlusDays)
  notSet: count(entity: "task", filterBy: $notSet)
}
`;
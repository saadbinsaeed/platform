/* @flow */

import gql from 'graphql-tag';

const fragments = {
    entity: `fragment RelationshipList on Entity {
        id
        name
        image
    }`,
    thing: `fragment RelationshipList on Thing {
        id
        name
        image
    }`,
    person: `fragment RelationshipList on Person {
        id
        name
        image
    }`,
    organisation: `fragment RelationshipList on Organisation {
        id
        name
        image
    }`,
    customEntity: `fragment RelationshipList on CustomEntity {
        id
        name
        image
    }`,
    task: `fragment RelationshipList on Task {
        id
        name
        priority
        endDate
        variable {
          completion
        }
    }`,
    process: `fragment RelationshipList on Process {
        id
        name
        variables(fields: ["priority"])
        endDate
        processDefinition {
            deployedModel {
                modelData(fields: ["icon"])
            }
        }
    }`,
};

const generate = (entity: string, query: string) => {
    const RelationshipList = fragments[entity] || fragments['entity'];
    return gql`
        ${RelationshipList}
        query addRelationshipsQuery($filterBy: [JSON], $excludeBy: [JSON], $orderBy: [JSON], $countMax: Int, $startIndex: Int, $stopIndex: Int) {
            count: count(entity: "${entity}", filterBy: $filterBy, excludeBy: $excludeBy, max: $countMax)
            records: ${query}(filterBy: $filterBy, excludeBy: $excludeBy, orderBy: $orderBy, startIndex: $startIndex, stopIndex: $stopIndex) {
                ...RelationshipList
            }
        }
    `;
};

export default generate;

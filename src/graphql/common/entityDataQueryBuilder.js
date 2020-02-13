/* @flow */

import gql from 'graphql-tag';

const stringTypes = ['task', 'process'];

export default ({ type, id }: Object) => {
    const entityId = stringTypes.includes(type) ? JSON.stringify(String(id)) : Number(id); // Because tasks and processes require id to be in string and others require it to be in number
    return  gql`
        query entityDataQueryBuilder {
            result: ${type}(id: ${entityId}){
                id
            }
        }
    `;
};

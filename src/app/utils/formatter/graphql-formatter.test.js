import { formatArray } from './graphql-formatter';


describe('GraphQL Formatter', () => {

    test('formatArray', () => {
        expect(formatArray(null)).toEqual('[]');
        expect(formatArray(undefined)).toEqual('[]');
        expect(formatArray([])).toEqual('[]');
        expect(formatArray([{ name: 'endDate', op: 'is null' }])).toEqual('[{name: "endDate", op: "is null"}]');
        expect(formatArray([{ name: 'createDate', direction: 'desc' }])).toEqual('[{name: "createDate", direction: "desc"}]');
    });
});

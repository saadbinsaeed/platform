import { shallowEquals } from './utils';

describe('shallowEquals', () => {
    test('objects are equals', () => {
        const a = { x: 12, y: 123, z: 'ok' };
        const b = a;
        expect(shallowEquals(a, b)).toBeTruthy();
    });
    test('properties x and y are equals', () => {
        const a = { x: 12, y: 123, z: 'ok' };
        const b = { ...a, z: 'ko' };
        expect(shallowEquals(a, b, ['x', 'y'])).toBeTruthy();
    });
    test('properties x and y are equals', () => {
        const a = { x: { test: 'something' }, y: 123, z: 'ok', j: { test: 'something else' } };
        const b = { x: a.x, y: a.y };
        expect(shallowEquals(a, b, ['x', 'y'])).toBeTruthy();
    });
});

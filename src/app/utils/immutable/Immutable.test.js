
import Immutable, { List, merge, push, pop, shift, unshift, reverse, sort, splice, isImmutable } from './Immutable';

describe('Constructors', () => {
    describe('Immutable', () => {

        test('without argument', () => {
            expect(Immutable()).toBeUndefined();
        });

        test('null argument', () => {
            expect(Immutable(null)).toBeNull();
        });

        test('Using a boolean as argument', () => {
            expect(Immutable(false)).toBeFalsy();
        });

        test('Using a number as argument', () => {
            expect(Immutable(12)).toEqual(12);
        });

        test('Using a string as argument', () => {
            expect(Immutable('test value')).toEqual('test value');
        });

        test('Using a date as argument', () => {
            expect(Immutable(new Date(1231212))).toEqual(new Date(1231212));
        });

        test('freeze the argument', () => {
            const obj = { a: true, b: [1, 2, 'three'], c: { d: 'e' } };
            const immutableObj = Immutable(obj);
            expect(immutableObj).toEqual({ a: true, b: [1, 2, 'three'], c: { d: 'e' } });
            expect(Object.isFrozen(immutableObj)).toBeTruthy();
            expect(obj === immutableObj).toBeTruthy();
        });
    });

    describe('List', () => {

        test('default value', () => {
            expect(List()).toEqual([]);
        });

        test('freeze the argument', () => {
            const list = [1, 2, 'three'];
            const immutableList = List(list);
            expect(immutableList).toEqual([1, 2, 'three']);
            expect(Object.isFrozen(list)).toBeTruthy();
            expect(list === immutableList).toBeTruthy();
            expect(() => { list.push(2); }).toThrow();
            expect(list[2]).toEqual('three');
        });
    });
});


describe('Immutability Test', () => {

    describe('is immutable (recursive)', () => {
        const x = Object.freeze({ a: Object.freeze({ b: 3, c: 4, d: Object.freeze([ 5, 6, Object.freeze({ x: 'y' }) ]) }) });
        expect(isImmutable(x, true)).toBeTruthy();
    });

    describe('is mutable (recursive)', () => {
        const x = Object.freeze({ a: Object.freeze({ b: 3, c: 4, d: Object.freeze([ 5, 6, { x: 'y' } ]) }) });
        x.a.d[2].x = 'modified';
        expect(isImmutable(x, true)).toBeFalsy();
    });

});

describe('Object Modifier', () => {

    const state = Immutable({ a: { b: 1, d: 4 } });
    const expectedNext = Immutable({ a: { b: 2, c: 3, d: 4 } });

    describe('merge', () => {
        const next = merge(state, { a: { b: 2, c: 3 } });
        expect(next).toEqual(expectedNext);
        expect(isImmutable(next)).toBeTruthy();
    });
});

describe('Array Modifier', () => {

    const array = List([ 'a', false, 2, 3, true, 5, 6, 'z' ]);

    describe('push', () => {
        test('push(4)', () => {
            const next = push(array, 4);
            expect(next).toEqual([ 'a', false, 2, 3, true, 5, 6, 'z', 4 ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
        test('push(4, \'new\')', () => {
            const next = push(array, 4, 'new');
            expect(next).toEqual([ 'a', false, 2, 3, true, 5, 6, 'z', 4, 'new' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
    });

    describe('pop', () => {
        test('pop()', () => {
            const next = pop(array);
            expect(next).toEqual([ 'a', false, 2, 3, true, 5, 6 ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
    });

    describe('shift', () => {
        test('shift()', () => {
            const next = shift(array);
            expect(next).toEqual([ false, 2, 3, true, 5, 6, 'z' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
    });

    describe('unshift', () => {
        test('unshift(4)', () => {
            const next = unshift(array, 4);
            expect(next).toEqual([ 4, 'a', false, 2, 3, true, 5, 6, 'z' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
        test('unshift(4, \'new\')', () => {
            const next = unshift(array, 4, 'new');
            expect(next).toEqual([ 4, 'new', 'a', false, 2, 3, true, 5, 6, 'z' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
    });

    describe('reverse', () => {
        test('reverse()', () => {
            const next = reverse(array);
            expect(next).toEqual([ 'z', 6, 5, true, 3, 2, false, 'a' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
    });

    describe('sort', () => {
        test('sort()', () => {
            const next = sort(array);
            expect(next).toEqual([ 2, 3, 5, 6, 'a', false, true, 'z' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
        test('sort() with custom comparator', () => {
            const next = sort(array, (a, b) => (a > b));
            expect(next).toEqual([ 'a', false, true, 2, 3, 5, 6, 'z' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
    });

    describe('splice', () => {
        test('insert \'drum\' at 2-index position', () => {
            const next = splice(array, 2, 0, 'drum');
            expect(next).toEqual([ 'a', false, 'drum', 2, 3, true, 5, 6, 'z' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
        test('remove 1 item at 2-index position', () => {
            const next = splice(array, 2, 1);
            expect(next).toEqual([ 'a', false, 3, true, 5, 6, 'z' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
        test('substitute the item at 2-index position with \'drum\'', () => {
            const next = splice(array, 2, 1, 'drum');
            expect(next).toEqual([ 'a', false, 'drum', 3, true, 5, 6, 'z' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });
        test('at position 0 remove 2 items and add \'parrot\', \'anemone\', \'blue\'', () => {
            const next = splice(array, 0, 2, 'parrot', 'anemone', 'blue');
            expect(next).toEqual([ 'parrot', 'anemone', 'blue', 2, 3, true, 5, 6, 'z' ]);
            expect(Object.isFrozen(next)).toBeTruthy();
        });

    });

});

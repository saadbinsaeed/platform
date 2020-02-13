import Immutable from 'app/utils/immutable/Immutable';
import { isDefined, get, set, sortBy, groupBy, keyBy, map } from './lo';

describe('isDefined', () => {
    test('pass a null object to isDefined', () => {
        expect(isDefined(null)).toBeFalsy();
    });
    test('pass undefined to isDefined', () => {
        expect(isDefined()).toBeFalsy();
        expect(isDefined(undefined)).toBeFalsy();
    });
    test('pass 0 to isDefined', () => {
        expect(isDefined(0)).toBeTruthy();
    });
    test('pass 1 to isDefined', () => {
        expect(isDefined(1)).toBeTruthy();
    });
    test('pass false to isDefined', () => {
        expect(isDefined(false)).toBeTruthy();
    });
    test('pass tre to isDefined', () => {
        expect(isDefined(true)).toBeTruthy();
    });
    test('pass a date to isDefined', () => {
        expect(isDefined(new Date())).toBeTruthy();
    });
    test('pass a string to isDefined', () => {
        expect(isDefined('')).toBeTruthy();
        expect(isDefined('test')).toBeTruthy();
    });
});

describe('set', () => {

    describe('set._getPath', () => {
        test('a', () => { expect(set._getPath('a')).toEqual([ 'a' ]); });
        test('a.b', () => { expect(set._getPath('a.b')).toEqual([ 'a', 'b' ]); });
        test('a.b[0]', () => { expect(set._getPath('a.b[0]')).toEqual([ 'a', 'b', 0 ]); });
        test('a.b[0][3]', () => { expect(set._getPath('a.b[0][3]')).toEqual([ 'a', 'b', 0, 3 ]); });
        test('a.b[0][3].c.3', () => { expect(set._getPath('a.b[0][3].c.3')).toEqual([ 'a', 'b', 0, 3, 'c', '3' ]); });
    });

    test('simple set', () => {
        const state = Immutable({ a: true, b: [1, 2, 'three'], c: { d: 'e' } });
        const updated = set(state, 'c.d', 'f');
        expect(updated).toEqual({ a: true, b: [1, 2, 'three'], c: { d: 'f' } });
        expect(Object.isFrozen(updated));
    });

    test('autovivification', () => {
        const state = Immutable({ a: true, b: [1, 2, 'three'], c: { d: 'e' } });
        const updated = set(state, 'c.x.y.z', 123);
        expect(updated).toEqual({ a: true, b: [1, 2, 'three'], c: { d: 'e', x: { y: { z: 123 } } } });
        expect(Object.isFrozen(updated));
    });

    test('autovivification of an empty object', () => {
        const state = Immutable({ });
        const updated = set(state, 'b.c', 123);
        expect(updated).toEqual({ b: { c: 123 } });
        expect(Object.isFrozen(updated));
    });

    test('autovivification of a null object', () => {
        let updated = set(null, 'b.c', 123);
        expect(updated).toEqual({ b: { c: 123 } });
        expect(Object.isFrozen(updated));
        updated = set(undefined, 'd', 'ok');
        expect(updated).toEqual({ d: 'ok' });
        expect(Object.isFrozen(updated));
    });

    describe('using array', () => {

        test('empty array', () => {
            const state = Immutable([]);
            const updated = set(state, '[0].name', 'luca');
            expect(Object.isFrozen(updated));
            expect(updated).toEqual([ { name: 'luca' } ]);
        });

        test('simple array', () => {
            const state = Immutable([ 'a', 'b' ]);
            const updated = set(state, '[1]', 'muted');
            expect(Object.isFrozen(updated));
            expect(updated).toEqual([ 'a', 'muted' ]);
        });

        test('replace an item', () => {
            const state = Immutable({ a: { b: [1, 2, 'three'] } });
            const updated = set(state, 'a.b[2]', 123);
            expect(Object.isFrozen(updated));
            expect(updated).toEqual({ a: { b: [1, 2, 123] } });
        });

        test('add an item', () => {
            const state = Immutable({ a: { b: [1, 2, 'three'] } });
            const updated = set(state, 'a.b[4]', 123);
            expect(Object.isFrozen(updated));
            expect(updated).toEqual({ a: { b: [1, 2, 'three', undefined, 123] } });
        });

        test('update a property of an item of the array', () => {
            const state = Immutable({ a: { b: [ 1, 2, { nested: { ready: false, type: 'x' } } ] } });
            const updated = set(state, 'a.b[2].nested.ready', true);
            expect(Object.isFrozen(updated));
            expect(updated).toEqual({ a: { b: [ 1, 2, { nested: { ready: true, type: 'x' } } ] } });
        });

        test('multidimensional array', () => {
            const state = Immutable({ a: { b: [ 1, 2, [ { nested: { ready: false, type: 'x' } } ] ] } });
            const updated = set(state, 'a.b[2][0].nested.ready', true);
            expect(Object.isFrozen(updated));
            expect(updated).toEqual({ a: { b: [ 1, 2, [ { nested: { ready: true, type: 'x' } } ] ] } });
        });

    });

});

describe('get', () => {
    test('pass a null object to the get', () => {
        expect(get(null, 'a.b[0].c')).toBeUndefined();
    });
    test('pass an undefined object to the get', () => {
        expect(get(undefined, 'a.b[0].c')).toBeUndefined();
    });
    test('get a null value', () => {
        expect(get({ a: { b: [ { c: null } ] } }, 'a.b[0].c')).toBeNull();
    });
    test('get an undefined value', () => {
        expect(get({ a: { b: [ { c: undefined } ] } }, 'a.b[0].c')).toBeUndefined();
    });
    test('get a boolean', () => {
        expect(get({ a: { b: [ { c: true } ] } }, 'a.b[0].c')).toBeTruthy();
        expect(get({ a: { b: [ { c: false } ] } }, 'a.b[0].c')).toBeFalsy();
    });
    test('get a number', () => {
        expect(get({ a: -1 }, 'a')).toEqual(-1);
        expect(get({ a: 0 }, 'a')).toEqual(0);
        expect(get({ a: 120 }, 'a')).toEqual(120);
    });
    test('get an object', () => {
        expect(get([{ a: -1 }], '[0]')).toEqual({ a: -1 });
        expect(get([{ i: { a: 0 } }], '[0].i')).toEqual({ a: 0 });
        expect(get([{}, { a: 120 }], '[1]')).toEqual({ a: 120 });
    });
});

describe('keyBy', () => {
    test('pass a null object to the keyBy', () => {
        expect(keyBy(null, 'id')).toEqual({});
    });
    test('pass an undefined object to the keyBy', () => {
        expect(keyBy(undefined, 'id')).toEqual({});
    });
    test('keyBy a proper key', () => {
        expect(keyBy([ { 'dir': 'left', 'code': 97 }, { 'dir': 'right', 'code': 100 } ], 'dir'))
            .toEqual({ 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } });
    });
    test('keyBy a bad key', () => {
        expect(keyBy([ { 'dir': 'left', 'code': 97 }, { 'dir': 'right', 'code': 100 } ], 'id')).toEqual({});
    });
    test('keyBy: an element does not contains the key', () => {
        expect(keyBy([ { 'dir': 'left', 'code': 97 }, { 'id': 'right', 'code': 100 } ], 'dir'))
            .toEqual({ 'left': { 'dir': 'left', 'code': 97 } });
    });
});

describe('groupBy', () => {
    test('undefined collection', () => {
        expect(groupBy(undefined, 'id')).toEqual({});
        expect(groupBy(null, 'id')).toEqual({});
    });
    test('groupBy a proper key', () => {
        expect(groupBy([ { 'dir': 'left', 'code': 97 }, { 'dir': 'right', 'code': 100 }, { 'dir': 'left', 'code': 111 }, ], 'dir'))
            .toEqual({ 'left': [{ 'dir': 'left', 'code': 97 }, { 'dir': 'left', 'code': 111 }], 'right': [{ 'dir': 'right', 'code': 100 }] });
    });
    test('groupBy a bad key', () => {
        expect(groupBy([ { 'dir': 'left', 'code': 97 }, { 'dir': 'right', 'code': 100 } ], 'id'))
            .toEqual({ 'undefined': [{ 'dir': 'left', 'code': 97 }, { 'dir': 'right', 'code': 100 }] });
    });
    test('groupBy: an element does not contains the key', () => {
        expect(groupBy([ { 'dir': 'left', 'code': 97 }, { 'id': 'right', 'code': 100 } ], 'dir'))
            .toEqual({ 'left': [{ 'dir': 'left', 'code': 97 }], 'undefined': [{ 'id': 'right', 'code': 100 }] });
    });
});


describe('map', () => {
    const mapFunc = ({ id, name }, index) => ({ id, name: name || '_no_value_', key: index });
    test('undefined collection', () => {
        expect(map(undefined, mapFunc)).toEqual([]);
        expect(map(null, mapFunc)).toEqual([]);
    });
    const list = [{ 'name': 'left', 'id': 97 }, { 'name': 'right', 'id': 100 }, { 'id': 111 }];
    test('map an array', () => {
        expect(map(list, mapFunc))
            .toEqual([{ id: 97, name: 'left', key: 0 }, { id: 100, name: 'right', key: 1 }, { id: 111, name: '_no_value_', key: 2 }]);
    });
    const obj = { f1: { 'name': 'left', 'id': 97 }, f2: { 'name': 'right', 'id': 100 }, f3: { 'id': 111 } };
    test('map an object', () => {
        expect(map(obj, mapFunc))
            .toEqual([{ id: 97, name: 'left', key: 'f1' }, { id: 100, name: 'right', key: 'f2' }, { id: 111, name: '_no_value_', key: 'f3' }]);
    });
});

describe('sortBy', () => {
    const x = [
        {'order_no':'0','name':'name','f_uri':'bj5/name','id':'bj5/name','type':'text'},
        {'order_no':'1','name':'age','f_uri':'bj5/age','id':'bj5/age','type':'int'},
        {'order_no':'2','name':'surname','f_uri':'bj5/surname','id':'bj5/surname','type':'text'},
        {'order_no':'3','name':'score','f_uri':'bj5/score','id':'bj5/score','type':'int'},
    ];
    const y = [
        {'order_no':'0','name':'name','f_uri':'bj5/name','id':'bj5/name','type':'text'},
        {'order_no':'2','name':'surname','f_uri':'bj5/surname','id':'bj5/surname','type':'text'},
        {'order_no':'3','name':'score','f_uri':'bj5/score','id':'bj5/score','type':'int'},
        {'order_no':'1','name':'age','f_uri':'bj5/age','id':'bj5/age','type':'int'},
    ];
    test('undefined collection', () => {
        expect(sortBy(undefined, 'order_no')).toEqual([]);
        expect(sortBy(null, 'order_no')).toEqual([]);
    });
    test('compare using a field value (order_no)', () => {
        expect(sortBy(x, 'order_no')).toEqual([
            {'order_no':'0','name':'name','f_uri':'bj5/name','id':'bj5/name','type':'text'},
            {'order_no':'1','name':'age','f_uri':'bj5/age','id':'bj5/age','type':'int'},
            {'order_no':'2','name':'surname','f_uri':'bj5/surname','id':'bj5/surname','type':'text'},
            {'order_no':'3','name':'score','f_uri':'bj5/score','id':'bj5/score','type':'int'},
        ]);
        expect(sortBy(y, 'order_no')).toEqual([
            {'order_no':'0','name':'name','f_uri':'bj5/name','id':'bj5/name','type':'text'},
            {'order_no':'1','name':'age','f_uri':'bj5/age','id':'bj5/age','type':'int'},
            {'order_no':'2','name':'surname','f_uri':'bj5/surname','id':'bj5/surname','type':'text'},
            {'order_no':'3','name':'score','f_uri':'bj5/score','id':'bj5/score','type':'int'},
        ]);
    });
    test('compare using two fields (type, name)', () => {
        expect(sortBy(x, ['type', 'name'])).toEqual([
            {'order_no':'1','name':'age','f_uri':'bj5/age','id':'bj5/age','type':'int'},
            {'order_no':'3','name':'score','f_uri':'bj5/score','id':'bj5/score','type':'int'},
            {'order_no':'0','name':'name','f_uri':'bj5/name','id':'bj5/name','type':'text'},
            {'order_no':'2','name':'surname','f_uri':'bj5/surname','id':'bj5/surname','type':'text'},
        ]);
        expect(sortBy(y, ['type', 'name'])).toEqual([
            {'order_no':'1','name':'age','f_uri':'bj5/age','id':'bj5/age','type':'int'},
            {'order_no':'3','name':'score','f_uri':'bj5/score','id':'bj5/score','type':'int'},
            {'order_no':'0','name':'name','f_uri':'bj5/name','id':'bj5/name','type':'text'},
            {'order_no':'2','name':'surname','f_uri':'bj5/surname','id':'bj5/surname','type':'text'},
        ]);
    });
    test('compare using a getter function', () => {
        expect(sortBy(x, field => parseInt(field.order_no, 10))).toEqual([
            {'order_no':'0','name':'name','f_uri':'bj5/name','id':'bj5/name','type':'text'},
            {'order_no':'1','name':'age','f_uri':'bj5/age','id':'bj5/age','type':'int'},
            {'order_no':'2','name':'surname','f_uri':'bj5/surname','id':'bj5/surname','type':'text'},
            {'order_no':'3','name':'score','f_uri':'bj5/score','id':'bj5/score','type':'int'},
        ]);
        expect(sortBy(y, field => parseInt(field.order_no, 10))).toEqual([
            {'order_no':'0','name':'name','f_uri':'bj5/name','id':'bj5/name','type':'text'},
            {'order_no':'1','name':'age','f_uri':'bj5/age','id':'bj5/age','type':'int'},
            {'order_no':'2','name':'surname','f_uri':'bj5/surname','id':'bj5/surname','type':'text'},
            {'order_no':'3','name':'score','f_uri':'bj5/score','id':'bj5/score','type':'int'},
        ]);
    });
});

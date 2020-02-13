import memoize from 'memoize-one';

import { shallowEquals } from './utils';

describe('memoize function', () => {

    test('single string argument', () => {
        let count = 0;
        const hello = memoize(name => `${++count}. Hello ${name}`);
        expect(hello('Luca')).toEqual('1. Hello Luca');
        expect(hello('Luca')).toEqual('1. Hello Luca');
        expect(hello('Denys')).toEqual('2. Hello Denys');
        expect(hello('Denys')).toEqual('2. Hello Denys');
        expect(hello('Luca')).toEqual('3. Hello Luca');
        expect(hello('Luca')).toEqual('3. Hello Luca');
    });

    test('two string arguments', () => {
        let count = 0;
        const hello = memoize((name, surname) => `${++count}. Hello ${name} ${surname}`);
        expect(hello('Luca', 'Pinelli')).toEqual('1. Hello Luca Pinelli');
        expect(hello('Luca', 'Pinelli')).toEqual('1. Hello Luca Pinelli');
        expect(hello('Denys', 'Bogdanov')).toEqual('2. Hello Denys Bogdanov');
        expect(hello('Denys', 'Bogdanov')).toEqual('2. Hello Denys Bogdanov');
        expect(hello('Luca', 'Pinelli')).toEqual('3. Hello Luca Pinelli');
        expect(hello('Luca', 'Pinelli')).toEqual('3. Hello Luca Pinelli');
    });

    test('two object arguments', () => {
        let count = 0;
        const sum = memoize(({ a }, [ b ]) => `${++count}. The sum is ${a + b}`);
        const first = { a: 1 };
        const second = [ 2 ];
        expect(sum(first, second)).toEqual('1. The sum is 3');
        expect(sum(first, second)).toEqual('1. The sum is 3');
        expect(sum(first, [ 2 ])).toEqual('2. The sum is 3');
        expect(sum(first, [ 2 ])).toEqual('3. The sum is 3');
        expect(sum(first, [ 4 ])).toEqual('4. The sum is 5');
        expect(sum(first, second)).toEqual('5. The sum is 3');
        expect(sum(first, second)).toEqual('5. The sum is 3');
    });


    test('one wrapper (object) argument', () => {
        let count = 0;
        const hello = memoize(({ name, surname }) => `${++count}. Hello ${name} ${surname}`, shallowEquals);
        expect(hello({ name: 'Luca', surname: 'Pinelli'})).toEqual('1. Hello Luca Pinelli');
        expect(hello({ name: 'Luca', surname: 'Pinelli'})).toEqual('1. Hello Luca Pinelli');
        expect(hello({ name: 'Denys', surname: 'Bogdanov'})).toEqual('2. Hello Denys Bogdanov');
        expect(hello({ name: 'Denys', surname: 'Bogdanov'})).toEqual('2. Hello Denys Bogdanov');
        expect(hello({ name: 'Luca', surname: 'Pinelli'})).toEqual('3. Hello Luca Pinelli');
        expect(hello({ name: 'Luca', surname: 'Pinelli'})).toEqual('3. Hello Luca Pinelli');
    });

});


let simpleHelloCounter = 0;

/**
 *
 */
class Simple {
    hello = memoize(name => `Hello ${name} (count ${++simpleHelloCounter})`)
}

let simpleStaticHelloCounter = 0;

/**
 *
 */
class SimpleStatic {
    static hello = memoize(name => `Hello ${name} (count ${++simpleStaticHelloCounter})`)
}

describe('memoize class functions', () => {

    test('instace function', () => {
        const a = new Simple();
        const b = new Simple();
        expect(a.hello('Luca')).toEqual('Hello Luca (count 1)');
        expect(b.hello('Luigi')).toEqual('Hello Luigi (count 2)');
        expect(a.hello('Luca')).toEqual('Hello Luca (count 1)');
        expect(b.hello('Luigi')).toEqual('Hello Luigi (count 2)');
        expect(a.hello('Mario')).toEqual('Hello Mario (count 3)');
        expect(b.hello('Andrea')).toEqual('Hello Andrea (count 4)');
        expect(a.hello('Mario')).toEqual('Hello Mario (count 3)');
        expect(b.hello('Andrea')).toEqual('Hello Andrea (count 4)');
    });

    test('static function', () => {
        const a = new SimpleStatic('hi');
        const b = new SimpleStatic('hello');
        expect(a.constructor.hello('Luca')).toEqual('Hello Luca (count 1)');
        expect(b.constructor.hello('Luigi')).toEqual('Hello Luigi (count 2)');
        expect(a.constructor.hello('Luca')).toEqual('Hello Luca (count 3)');
        expect(b.constructor.hello('Luigi')).toEqual('Hello Luigi (count 4)');
        expect(a.constructor.hello('Mario')).toEqual('Hello Mario (count 5)');
        expect(b.constructor.hello('Andrea')).toEqual('Hello Andrea (count 6)');
        expect(a.constructor.hello('Mario')).toEqual('Hello Mario (count 7)');
        expect(b.constructor.hello('Andrea')).toEqual('Hello Andrea (count 8)');
    });

});

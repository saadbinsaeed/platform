/* @flow */

export default function classMethodDecorator(decorator: any) {
    return (target: Object, key: string, descriptor: Object) => {
        if (!descriptor || typeof descriptor.value !== 'function') {
            throw new Error(`Unable to apply "@${decorator.name}" for "${key}": it must be class method.`);
        }
        return decorator(target, key, descriptor);
    };
}

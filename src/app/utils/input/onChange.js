/* @flow */

export function onChangeFix(onChange: Function, event: Object) {
    if (typeof event.target.value === 'string') {
        event.target.value = event.target.value.trimLeft();
    }
    return onChange(event);
}

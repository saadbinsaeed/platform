/* @flow */

/**
 * Creates an event.
 *
 * @param type the type of event to create.
 * @param target the value to se in the target property.
 */
const createEvent = (type: string, target: {name: string, value: any}): Event => {
    const event = new Event(type);
    window.Object.defineProperty(event, 'target', { value: target });
    return event;
};

export { createEvent };

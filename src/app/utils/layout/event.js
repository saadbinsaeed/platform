/**
 * A small function to make creating multiple events easier
 * @param element - Element event is attached to
 * @param ev - The event to call i.e onclick, onload etc
 * @param func - The function to call
 * @constructor
 */
function Event(element, ev, func) {
    ev.split(' ').forEach(event => element.addEventListener(event, func));
}

export default Event;
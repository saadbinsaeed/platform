/* @flow */

import { DropResult, DraggableLocation } from 'react-beautiful-dnd';

/**
 * Moves an item in a list.
 *
 * @param items a list of items.
 * @param itemIndex the index of the item to move.
 * @param destinationIndex the index where we need to move the item.
 * @return the modified list of items.
 */
const move = (items: Object[], itemIndex: number, destinationIndex: number): any[] => {
    const result = [...items];
    const [removed] = result.splice(itemIndex, 1);
    result.splice(destinationIndex, 0, removed);
    return result;
};

/**
 * Moves an item from one group to another one.
 *
 * @param sourceGroup the group that contains the item.
 * @param sourceIndex the index of the item to move.
 * @param descrtinationGroup the group where we need to move the item.
 * @param destinationIndex the index where we need to move the item.
 * @return the modified groups.
 */
const changeGroup = (sourceGroup: Object, sourceIndex: number, destinationGroup: Object, destinationIndex: number): Object => {
    // update the group_name of the item
    const item = {
        ...sourceGroup.items[sourceIndex],
        group_name: destinationGroup.name,
    };
    // remove the item from source group
    sourceGroup.items.splice(sourceIndex, 1);
    // add the item in the destination group
    destinationGroup.items.splice(destinationIndex, 0, item);

    return {
        [sourceGroup.name]: sourceGroup.items,
        [destinationGroup.name]: destinationGroup.items,
    };
};

/**
 * Moves the dragged field.
 *
 * @param groups the map of the groups.
 * @param dropSource the drop source.
 * @param dropDestination the drop destination.
 *
 * @return the modified groups.
 */
export const moveField = (groups: Object, dropResult: DropResult) => {

    const source: DraggableLocation = dropResult.source;
    const destination: DraggableLocation = dropResult.destination;

    const sourceGroup = { name: source.droppableId, items: groups[source.droppableId] };
    const sourceIndex = source.index;
    const destinationGroup = { name: destination.droppableId, items: groups[destination.droppableId] };
    const destinationIndex = destination.index;

    // moving to same group
    if (sourceGroup.name === destinationGroup.name) {
        const items = move(sourceGroup.items, sourceIndex, destinationIndex);
        return { ...groups, [sourceGroup.name]: items };
    }
    const modifiedGroups = changeGroup(sourceGroup, sourceIndex, destinationGroup, destinationIndex);
    return { ...groups, ...modifiedGroups };
};

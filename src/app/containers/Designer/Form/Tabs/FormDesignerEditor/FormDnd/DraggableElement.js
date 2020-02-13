/* @flow */

import React from 'react';
import { DragSource } from 'react-dnd';

const elementHandler = {
    beginDrag(props) {
        props.onDragStart && props.onDragStart({ ...props });
        return { ...props.element };
    },

    endDrag(props) {
        props.onDragEnd && props.onDragEnd({ ...props });
    },
};

const elementCollect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
});

const Element = ({ connectDragSource, isDragging, children, element, style }: Object) => connectDragSource(
    <div style={{ opacity: isDragging ? .2 : 1, position: 'relative', fontSize: 22, fontWeight: 'bold', cursor: 'move', ...style }}>
        {children}
    </div>
);

const DraggableElement = DragSource('ELEMENT', elementHandler, elementCollect)(Element);

export default DraggableElement;

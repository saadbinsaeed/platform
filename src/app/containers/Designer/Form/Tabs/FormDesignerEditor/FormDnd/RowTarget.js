/* @flow */

import React from 'react';
import { DropTarget } from 'react-dnd';

const renderOverlay = (color) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: color,
        }} />
    );
};

const Row = ({ x, y, connectDropTarget, isOver, canDrop, children, onDrop, element, isOverCurrent, index, ...rest }) => {
    return connectDropTarget(
        <div {...rest} key={index} style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
            {children}
            {!isOver && canDrop && renderOverlay('rgba(0, 0, 0, .2)') /* the color of the area */}
            {isOver && !canDrop && renderOverlay('red')  /* the color of the row when we can drop */}
            {isOver && canDrop && renderOverlay('#1a6eaf') /* the color of the row when we cannot drop */}
        </div>
    );
};

const EmptyRow = ({ x, y, connectDropTarget, isOver, canDrop, children, onDrop, element, isOverCurrent, ...rest }) => {
    return (
        <div>
            {children}
            {connectDropTarget(
                <div {...rest} style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                    {isOverCurrent && canDrop ? <div style={{ height: '60px', width: '100%' }} /> : <div style={{ height: '20px', width: '100%' }} />}
                    {!isOver && canDrop && renderOverlay('rgba(0, 0, 0, .2)') /* the color of the area */}
                    {isOver && canDrop && renderOverlay('#1a6eaf') /* the color of the row when we cannot drop */}
                </div>
            )}
        </div>
    );
};

const rowHandler = {
    canDrop(props: Object, monitor: Object, component: any) {
        return props.canDrop ? props.canDrop(props, monitor, component) : true;
    },

    drop(props: Object, monitor: Object, component: any) {
        props.onDrop && props.onDrop(props, monitor, component);
    },

    hover(props: Object, monitor: Object, component: any) {
        props.onHover && props.onHover(props, monitor, component);
    },
};

const rowCollect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    isOverCurrent: monitor.isOver({ shallow: true }),
});

const RowTarget = DropTarget(['ELEMENT', 'CONTAINER'], rowHandler, rowCollect)(Row);
export const EmptyRowTarget = DropTarget(['ELEMENT', 'CONTAINER'], rowHandler, rowCollect)(EmptyRow);

export default RowTarget;

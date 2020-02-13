/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import ListItem from './ListItem';

/**
 *
 */
class List extends Component<Object, Object> {
    static propTypes: Object = {
        classId: PropTypes.number,
        listId: PropTypes.string,
        groupData: PropTypes.any,
        listType: PropTypes.string,
        isDropDisabled: PropTypes.bool,
        style: PropTypes.object,
        ignoreContainerClipping: PropTypes.bool,
        removeListItem: PropTypes.func,
        canEdit: PropTypes.bool,
    };

    state: Object;
    // $FlowFixMe
    listRef = React.createRef();
    listSize = null;

    componentDidMount() {
        this.listSize = this.listRef.current && this.listRef.current.clientWidth;
    }

    renderLists = (provided: Object, style: Object) => {
        const { listType, groupData, canEdit, classId, ...rest } = this.props;
        return (
            <div ref={provided.innerRef} className="List">
                {groupData.map((rowData, index) => (
                    <Draggable key={rowData.id} draggableId={rowData.id} type={listType} index={index}>
                        {(provided, snapshot) => (
                            <div ref={this.listRef}>
                                <ListItem
                                    {...rest}
                                    key={rowData.id}
                                    rowData={rowData}
                                    isDragging={snapshot.isDragging}
                                    provided={provided}
                                    classId={classId}
                                    removeListItem={this.props.removeListItem}
                                    canEdit={canEdit}
                                    width={this.listSize}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                />
                                {provided.placeholder}
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        );
    };


    /**
     * render - description
     *
     * @return {type}  description
     */
    render() {
        const {
            ignoreContainerClipping,
            isDropDisabled,
            listId,
            listType,
            style,
            canEdit,
        } = this.props;
        return (
            <Droppable
                droppableId={listId}
                ignoreContainerClipping={ignoreContainerClipping}
                isDropDisabled={isDropDisabled || !canEdit}
                type={listType}
            >
                {(provided, snapshot) => (

                    this.renderLists(provided, style)

                )}
            </Droppable>
        );
    }
}

export default List;

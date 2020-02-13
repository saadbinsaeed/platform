/* @flow */
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import Drawer from 'app/components/atoms/Drawer/Drawer';
import Button from 'app/components/atoms/Button/Button';
import Icon from 'app/components/atoms/Icon/Icon';
import { set } from 'app/utils/lo/lo';

const Menu = styled.div`
  color: ${({ theme }) => theme.base.color};
`;

const MenuItem = styled.div`
  padding: .5rem;
  display: flex;
  justify-content: space-between;
`;

const DraggableItem = styled.div`
  ${({ isDragging }) => isDragging ? 'opacity: 0.5; background: green;' : ''};
  ${({ draggableStyle }) => draggableStyle || ''};
  ${({ dragHandleProps }) => dragHandleProps || ''};
  padding: 0 .4rem 0 0;
`;

/**
 *
 */
class DataTableColumnsSidebar extends PureComponent<Object, Object> {

    static propTypes = {
        isOpen: PropTypes.bool,
        toggle: PropTypes.func,
        columns: PropTypes.object.isRequired,
        columnsState: PropTypes.arrayOf(PropTypes.object).isRequired,
        onChange: PropTypes.func.isRequired,
        saveUserPreferences: PropTypes.func,
        loadUserPreferences: PropTypes.func,
        resetUserPreferences: PropTypes.func,
    };

    buildColumns = (columns: Object, columnsState: Array<Object>): Array<Object> =>
        (columnsState || []).map((state, originalIndex) => ({
            originalIndex,
            field: state.field,
            meta: columns[state.field],
            state,
        }));

    getFixedColumns = (columns: Array<Object>): Array<Object> =>
        columns.filter(column => column.meta.expander || column.meta.fixed);

    getSortableColumns = (columns: Array<Object>): Array<Object> =>
        columns.filter(column => !(column.meta.expander || column.meta.fixed));

    setVisibility = (event: Object, columnIndex: number) => {
        const columns = set(this.props, `columnsState[${String(columnIndex)}].visible`, event.target.value);
        if (this.props.onChange) {
            this.props.onChange(columns.columnsState);
        }
    };

    setOrder = (res: Object) => {
        const { columnsState, onChange } = this.props;
        if (!res.destination || !onChange) {
            return;
        }
        const columns = this.buildColumns(this.props.columns, columnsState);
        const sortableColumns = this.getSortableColumns(columns);
        const diff = columns.length - sortableColumns.length;
        const deleted = sortableColumns.splice(res.source.index - diff, 1);
        sortableColumns.splice(res.destination.index - diff, 0, deleted[0]);
        const allColumns = [...sortableColumns];
        const fixedColumns = this.getFixedColumns(columns);
        fixedColumns.forEach((column) => {
            allColumns.splice(column.originalIndex, 0, column);
        });
        onChange(allColumns.map(column => column.state));
    };

    getDraggableItems = memoize((columns: Array<Object>) =>
        this.getSortableColumns(columns).map(column => (
            <Draggable key={column.field} draggableId={column.field} index={column.originalIndex}>{(provided, snapshot) => ( // eslint-disable-line no-shadow
                <div>
                    <DraggableItem
                        key={column.field}
                        innerRef={provided.innerRef}
                        isDragging={snapshot.isDragging}
                        draggableStyle={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <MenuItem key={column.field}>
                            <Checkbox
                                key={column.field}
                                name={column.field}
                                label={column.meta.header}
                                checked={column.state.visible}
                                onChange={event => this.setVisibility(event, column.originalIndex)}
                            />
                            <Icon name="drag-vertical" />
                        </MenuItem>
                    </DraggableItem>
                    {provided.placeholder}
                </div>
            )}
            </Draggable>
        ))
    );


    /**
     *
     */
    render() {
        const { columnsState, isOpen, toggle, resetUserPreferences, loadUserPreferences, saveUserPreferences } = this.props;
        const columns = this.buildColumns(this.props.columns, columnsState);
        return (
            <Drawer title="Grid Options" isOpen={isOpen} isToggled={toggle}>
                { resetUserPreferences && <Button color="secondary" onClick={resetUserPreferences}>Default</Button> }
                {' '}
                { loadUserPreferences && <Button color="secondary" onClick={loadUserPreferences}>Reload</Button> }
                {' '}
                { saveUserPreferences && <Button color="primary" onClick={saveUserPreferences}>Save</Button> }
                <DragDropContext onDragEnd={this.setOrder}>
                    <Droppable droppableId="reorderableMenu" direction="vertical">
                        {(provided, snapshot) => (
                            <Menu innerRef={provided.innerRef} {...snapshot}>
                                {this.getDraggableItems(columns)}
                                {provided.placeholder}
                            </Menu>
                        )}
                    </Droppable>
                </DragDropContext>
            </Drawer>
        );
    }
}

export default DataTableColumnsSidebar;

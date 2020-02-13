/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const right = {
    position: 'absolute',
    width: '10px',
    cursor: 'col-resize',
    right: '0px',
    top: '0px',
    bottom: '0px',
};

/**
 * Column header wrapper.
 */
class DataTableColumnHeader extends PureComponent<Object, Object> {
    static propTypes = {
        columnDef: PropTypes.object.isRequired,
        onColumnResize: PropTypes.func.isRequired,
    };

    element = null;
    dragStartedAt = 0;

    onClick = (event: Object) => {
        event.stopPropagation();
    }

    onDragStart = (e: Object) => {
        e.stopPropagation();
        if (!e.nativeEvent || !Number.isFinite(e.nativeEvent.screenX)) {
            return;
        }
        this.dragStartedAt = e.nativeEvent.screenX;
    }

    onDragEnd = (e: Object) => {
        e.preventDefault();
        e.stopPropagation();
        if (!this.element || !e.nativeEvent || !Number.isFinite(e.nativeEvent.screenX)) {
            return;
        }
        const th = this.element.closest('th');
        if (!th || !Number.isFinite((th: Object).offsetWidth)) {
            return;
        }
        const dragEndedAt = e.nativeEvent.screenX;
        const resize = dragEndedAt - this.dragStartedAt;
        const width = (th: Object).offsetWidth;
        const newWidth = Math.max(20, width + resize); // if less than 20 px I can't resize the column
        this.props.onColumnResize(this.props.columnDef.field, newWidth);
    }

    /**
     * @override
     */
    render() {
        const { columnDef } = this.props;
        return (
            /* eslint-disable jsx-a11y/no-static-element-interactions */
            <div ref={(el) => { this.element = el; }} style={{ display: 'inline' }}>
                {columnDef && columnDef.header}
                <div
                    style={right}
                    draggable="true"
                    onClick={this.onClick}
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                />
            </div>
            /* eslint-enable jsx-a11y/no-static-element-interactions */
        );
    }
}

export default DataTableColumnHeader;

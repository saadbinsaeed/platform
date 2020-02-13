/* @flow */
import React from 'react';
import styled from 'styled-components';
import { TreeTable as PrimeTreeTable } from 'primereact/components/treetable/TreeTable';

/**
 *
 */
class BaseTreeTable extends PrimeTreeTable {

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);
        this.selection = props.selection;
    }

    /**
     * @override
     */
    componentWillReceiveProps(nextProps) {
        // super.componentWillReceiveProps(nextProps);
        const { selection } = nextProps;
        this.selection = selection;
    }

    /**
     * @override
     */
    findIndexInSelection(node) {
        let index = -1;
        if (this.props.selectionMode && this.selection && node.id) {
            if (this.isSingleSelectionMode()) {
                index = this.selection.id === node.id ? 1 : 0;
            } else {
                for (let i = 0; i < this.selection.length; i++) {
                    if (this.selection[i].id === node.id) {
                        index = i;
                        break;
                    }
                }
            }
        }
        // index >= 0 && this.propagateSelectionUp(node, true);
        return index;
    }
}

const TreeTableStyle = styled(BaseTreeTable)``;

const TreeTable = (props: Object) => <TreeTableStyle {...props} />;

export default TreeTable;

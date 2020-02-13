/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from '../../../ButtonIcon/ButtonIcon';

/**
 * Toggle sub-content for grid
 */
class ToggleSubRenderer extends PureComponent<Object, Object> {
    /**
     * Define our prop types for this renderer
     */
    static propTypes = {
        value: PropTypes.string,
        rowIndex: PropTypes.number,
        api: PropTypes.object,
        isOpen: PropTypes.bool,
    };
    state: Object;

    /**
     * Set our default state
     */
    constructor(props: Object) {
        super(props);
        this.state = { isOpen: false };
    }
    /**
     * Toggle the opening/close of the subPanel
     */
    toggleSubRow = () => {
        this.setState({ isOpen: !this.state.isOpen });
        const rowIndex = this.props.rowIndex;
        // Hide/Show the row
        let rowData = [];
        if (!this.state.isOpen) {
            rowData = this.props.api.updateRowData({
                add: [{}],
                addIndex: rowIndex + 1
            });
        } else {
            rowData = this.props.api.setRowData(rowIndex);
        }
        // Return row
        // console.log('props', this.props);
        // console.log('state', this.state);
        return rowData;
    };
    /**
     * Render our icon with toggle function
     */
    render () {
        const { value } = this.props;
        return (
            <div><ButtonIcon icon="arrow-right" size="sm" onClick={this.toggleSubRow} />{value}</div>
        );
    }
}

export default ToggleSubRenderer;

/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { InputText } from 'primereact/components/inputtext/InputText';
import { DataTable as PrimeDataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import Button from 'app/components/atoms/Button/Button';
import { createEvent } from 'app/utils/http/event';
import Immutable, { set } from 'app/utils/immutable/Immutable';

const TableWrapper = styled.div`
    .ui-datatable .ui-editable-column.ui-cell-editing {
        display: block;
    }
    .ui-cell-data {
        display: block;
        overflow: hidden;
    }
`;

const ButtonStyle = styled(Button)`
    margin: 5px 0px;
`;

const defGridHeaders = ['Key', 'Value'];

const validateInputHandler = (props: Object, gridData: Array<Object>) => {
    const { rowIndex } = props;
    const length = gridData.length - 1;
    const updatedRow = gridData[rowIndex];
    if (length !== 0) {
        if (gridData[rowIndex]) {
            const { key, value } = updatedRow;
            if (key !== '') {
                const ifValueUniq = gridData.findIndex((kvPair) => {
                    if (!Object.is(kvPair, updatedRow)) {
                        return kvPair.key === key || kvPair.value === value;
                    }
                    return false;
                });
                if (ifValueUniq !== -1) {
                    return { severisArrayWithValuesity: 'error', detail: 'Please enter unique values' };
                }
            }
        }
    }
    return;
};

/**
 * Creates an editable key value pair table.
 */
export default class KeyValuePairTable extends Component<Object, Object> {

    static propTypes = {
        name: PropTypes.string,
        gridData: PropTypes.arrayOf(PropTypes.object),
        gridHeaders: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func,
        showToastr: PropTypes.func,
    };
    static defaultProps = {
        gridData: [{ key: '', value: '' }],
        gridHeaders: defGridHeaders,
    };

    /**
     * @override
     * @param props the Component's properties.
     */
    constructor(props: Object) {
        super(props);
        const { gridData } = props;
        this.state = Immutable({ gridData });
    }

    /**
     * @override
     * @param prevProps the properties that the component will receive.
     */
    componentDidUpdate(prevProps: Object) {
        const { gridData } = this.props;
        if (gridData !== prevProps.gridData) {
            this.setState(Immutable({ gridData }));
        }
    }

    /**
     * @param props
     * @param newValue
     */
    onEditorValueChange(props: Object, newValue: string) {
        if (props.field === 'key') {
            if (newValue.length > 50 ) {
                this.props.showToastr({ severity: 'warn', detail: 'Please enter key less than or equal to 50 characters' });
                return;
            }
        } else {
            if (newValue.length > 50 ) {
                this.props.showToastr({ severity: 'warn', detail: 'Please enter value less than or equal to 50 characters' });
                return;
            }
        }
        const gridData = set(this.state.gridData, `[${props.rowIndex}].${props.field}`, newValue);
        this.setState({ gridData });
        const { rowIndex } = props;
        const length = gridData.length - 1;
        const updatedRow = gridData[rowIndex];
        if (length !== 0) {
            if (gridData[rowIndex]) {
                const { key, value } = updatedRow;
                if (key !== '') {
                    const ifValueUniq = gridData.findIndex((kvPair) => {
                        if (!Object.is(kvPair, updatedRow)) {
                            return kvPair.key === key || kvPair.value === value;
                        }
                        return false;
                    });
                    if (key !== '' && value !== '' && ifValueUniq === -1) {
                        this.emitOnChange(gridData);
                    }
                } else {
                    this.props.showToastr({ severity: 'error', detail: 'Please fill all cells' });
                    return;
                }
            }
        }
        this.emitOnChange(gridData);
    }

    /**
     * Emits a change event
     * @param gridData
     */
    emitOnChange = (gridData: Object) => {
        const name = this.props.name;
        const value = gridData;
        const event = createEvent('change', { name, value });
        this.props.onChange(event);
    };

    /**
     * Adds an empty row to the grid.
     */
    onRowAdd = () => {
        const { gridData } = this.state;
        if (gridData.length > 0) {
            let update = true;
            gridData.forEach((obj) => {
                const dublicateRow = gridData.findIndex((kvPair) => {
                    if (!Object.is(kvPair, obj)) {
                        return kvPair.key === obj.key || kvPair.value === obj.value;
                    }
                    return false;
                });
                if (dublicateRow !== -1 || obj.value === '' || obj.key === '') {
                    this.props.showToastr({ severity: 'error', detail: 'Please fill all the cells with a unique value before adding a new option.' });
                    update = false;
                }
            });
            if (update) {
                this.setState({ gridData: [ ...gridData, { key: '', value: '' } ] });
            }
        } else {
            this.setState({ gridData: [ ...gridData, { key: '', value: '' } ] });
        }
    }

    /**
     * @param props
     * @param field
     */
    inputTextEditor(props: Object, field: string) {
        return <InputText
            type="text"
            value={this.state.gridData[props.rowIndex][field]}
            onBlur={() => validateInputHandler(props, this.state.gridData) && this.props.showToastr(validateInputHandler(props, this.state.gridData))}
            onChange={e => this.onEditorValueChange(props, e.target.value)}
        />;
    }
    /**
     * @param props
     */
    keyEditor = (props: Object) => {
        return this.inputTextEditor(props, 'key');
    };

    /**
     * @param props
     */
    valueEditor = (props: Object) => {
        return this.inputTextEditor(props, 'value');
    };

    /**
     * Remove row from grid.
     *
     * @param key the key of the row to remove.
     * @param removeIndex the index of the row to remove.
     */
    removeRow = (removeIndex: number) => {
        const { gridData } = this.state;
        const newData = gridData.filter((kvPair, index) => index !== removeIndex);
        this.setState({ gridData: newData });
        this.emitOnChange(newData);
    };

    /**
     *
     */
    handleRemoveRow = (e: Object, index: number) => {
        e.preventDefault();
        this.removeRow(index);
    };

    /**
     * @override
     */
    render() {
        const { gridHeaders } = this.props;
        return (
            <TableWrapper>
                <PrimeDataTable editable={true} value={[...this.state.gridData]}>
                    <Column field="key" header={gridHeaders[0] || defGridHeaders[0]} editor={this.keyEditor} />
                    <Column field="value" header={gridHeaders[1] || defGridHeaders[1]} editor={this.valueEditor} />
                    <Column
                        header="Action"
                        field="action"
                        body={(row, data) => <Button type="button" icon="delete" onClick={e => this.handleRemoveRow(e, data.rowIndex)} />}
                        style={{ width: '85px' }}
                    />
                </PrimeDataTable>
                <ButtonStyle color="primary" type="button" onClick={this.onRowAdd}> Add </ButtonStyle>
            </TableWrapper>
        );
    }
}

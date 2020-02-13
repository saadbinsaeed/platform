/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { DataTable as PrimeDataTable } from 'primereact/components/datatable/DataTable';
import memoize from 'memoize-one';

import { get } from 'app/utils/lo/lo';
import { saveDataTablePreferences, resetDataTablePreferences } from 'store/actions/admin/usersActions';
import { saveDataTableState } from 'store/actions/grid/gridActions';

import { DataTableContainer } from '../DataTableStyle';
import { AbstractTable } from '../AbstractTable';


/**
 * Class for rendering client side data table;
 */
class DataTableClient extends AbstractTable {

    static propTypes = {
        ...AbstractTable.propTypes,
    };

    buildStyle = memoize((columnComponents) => {
        const minWidth = this.calculateMinWidth(columnComponents);
        return { minWidth, overflowX: 'hidden' };
    });

    /**
     * @override
     */
    render() {
        const columnComponents = this.buildColumnComponents();
        const { filters } = this.state;
        return (
            <DataTableContainer style={this.buildStyle(columnComponents)}>
                <PrimeDataTable
                    {...this.props}
                    filters={{ ...filters }}
                >
                    {columnComponents}
                </PrimeDataTable>
            </DataTableContainer>
        );
    }
}

export default connect(
    ( state: Object, props: Object ): Object => ({
        tablePreferences: get(state, `user.preferences.dataTable.${props.dataTableId}`),
        tableReduxState: get(state, `grid.state.${props.dataTableId}`),
    }),
    { saveDataTablePreferences, resetDataTablePreferences, saveDataTableState },
)(DataTableClient);

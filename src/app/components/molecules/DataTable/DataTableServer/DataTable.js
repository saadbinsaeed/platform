/* @flow */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { DataTable as PrimeDataTable } from 'primereact/components/datatable/DataTable';
import { isBrowser } from 'react-device-detect';

import Loader from 'app/components/atoms/Loader/Loader';
import { debounce, shallowEquals } from 'app/utils/utils';
import { get, set } from 'app/utils/lo/lo';
import { resetDataTablePreferences, saveDataTablePreferences } from 'store/actions/admin/usersActions';
import { saveDataTableState } from 'store/actions/grid/gridActions';
import { showToastr } from 'store/actions/app/appActions';

import { AbstractTable } from '../AbstractTable';
import DataTableColumnsSidebar from '../common/DataTableColumnsSidebar';
import DataTableHeader from '../common/DataTableHeader';
import DataTablePaginator from '../common/DataTablePaginator';
import { DataTableContainer } from '../DataTableStyle';
import styled from 'styled-components';

const StyledPrimeDataTable = styled(PrimeDataTable)`
    .ui-datatable-scrollable-body {
        max-height: calc(100% - 100px) !important;
    }
`;
/**
 * Displays data in tabular format.
 */
class DataTable extends AbstractTable {

    static propTypes = {
        ...AbstractTable.propTypes,
        name: PropTypes.string,
        loadRows: PropTypes.func.isRequired,
        savePreferences: PropTypes.bool,
        isDownloading: PropTypes.bool,
        disableGlobalFilter: PropTypes.bool,
        disableCountdown: PropTypes.bool,
        disableExport: PropTypes.bool,
        records: PropTypes.array,
        SubDataTable: PropTypes.bool,
        totalRecords: PropTypes.number,
        countMax: PropTypes.number,
        queryParams: PropTypes.any,
        noRefresh: PropTypes.bool,
        dataKey: PropTypes.string,
        dataTableId: PropTypes.string,
        downloadAll: PropTypes.bool,
        customWhere: PropTypes.array,
        excludeBy: PropTypes.array,
        renderDataTableHeader: PropTypes.func,
    };

    columns: Object;

    loadParams: Object;

    queryOptions = { orderBy: [], where: [], page: 1, pageSize: 10 };

    state: Object;

    table: Object;

    unmounting = false;

    lastClickedRow: -1;

    // $FlowFixMe
    tableRef = React.createRef();

    // $FlowFixMe
    containerRef = React.createRef();

    /**
     * @param props the Component's properties
     */
    constructor(props: Object): void {
        super(props);

        (this: Object).changePage = this.changePage.bind(this);
        (this: Object).onFilter = this.onFilter.bind(this);
        (this: Object).onLazyLoad = this.onLazyLoad.bind(this);
        (this: Object).onSelectionChange = this.onSelectionChange.bind(this);
        (this: Object).rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        (this: Object).saveUserPreferences = this.saveUserPreferences.bind(this);
        (this: Object).toggleRow = this.toggleRow.bind(this);

        if (props.refreshRef) {
            props.refreshRef(this.loadData);
        }

        this.state = {
            ...this.state,
            gridKey: 1, // key used to force the grid render
            page: get(props, 'tableReduxState.page') || 1,
            settingsOpen: false,
            selection: [],
        };
    }

    /**
     * @override
     */
    getDefaultPreferences() {
        return {
            ...super.getDefaultPreferences(),
            pageSize: 10,
        };
    }

    /**
     * @override
     */
    resetUserPreferences() {
        super.resetUserPreferences();
        this.loadData();
    }

    /**
     * @override
     */
    restoreUserPreferences() {
        super.restoreUserPreferences();
        this.loadData();
    }

    exportDataTable = () => {
        super.exportData();
    };

    /**
     * @override
     */
    componentDidUpdate(prevProps: Object, prevState: Object, snapshot: Object) {
        const { tablePreferences, tableReduxState } = prevProps;
        const props = this.props;
        if (props.selection && props.selection.length && this.state.selection !== props.selection) {
            this.setState({ selection: props.selection });
        }
        if (tablePreferences !== props.tablePreferences) {
            this.setState({
                ...this.buildPreferences(props),
                gridKey: prevState.gridKey + 1,
                freezeData: false,
            });
        } else if (tableReduxState !== props.tableReduxState) {
            this.setState({ ...this.buildPreferences(props) });
        }
        super.componentDidUpdate(prevProps, prevState, snapshot);
    }

    /**
     * @override
     */
    componentDidMount() {
        this.props.onMount && this.props.onMount({ refresh: this.loadData });

        this.setTableBounds();
        window.addEventListener('resize', this.setTableBounds);

        const ref = this.containerRef.current;
        ref && ref.addEventListener('scroll', () => {
            ref.focus();
            ref.click();
        });
    }

    /**
     * @override
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.setTableBounds);
        this.unmounting = true;
    }

    setTableBounds = debounce(() => {
        // we need to check if the component is mounted because of the debounce delay
        if (this.unmounting) {
            return;
        }
        const rect = this.tableRef.current && this.tableRef.current.getBoundingClientRect();
        if (!shallowEquals(this.state.rect, rect || {})) {
            this.setState({
                rect,
                gridKey: this.state.gridKey + 1,
            });
        }
    }, 300);

    loadData = debounce(() => {
        if (!this.state.freezeData) {
            this.props.loadRows(this.buildQueryOptions());
        } else {
            this.setState({ freezeData: false });
        }
    }, 700);

    /**
     * Call function for server side filtering
     * @param event
     */
    onLazyLoad(event: Object) {
        const { multiSortMeta, sortField, sortOrder } = event;
        let sort = multiSortMeta || this.state.settings.sort || [];
        if (!multiSortMeta && sortField) {
            sort = [{ field: sortField, order: sortOrder }];
        }
        this.setState({
            settings: set(this.state.settings, 'sort', sort),
        }, this.loadData);
    }

    /**
     *
     */
    onFilter({ filters }: Object) {
        super.onFilter({ filters });
        this.loadData();
    }

    /**
     * @override
     */
    filter(options: Object) {
        return super.filter(options).then(() => {
            this.setState({ page: 1 }, this.loadData);
        });
    }

    /**
     * Function call for pagination
     * @param event
     */
    changePage({ first, rows }: Object) {
        const page = (first / rows) + 1;
        if (page !== this.state.page || rows !== this.state.settings.pageSize) {
            this.setState({
                settings: set(this.state.settings, 'pageSize', rows),
                page,
            }, this.loadData);
        }
    }

    /**
     *
     */
    onGlobalSearch(event: Object) {
        return super.onGlobalSearch(event).then(() => {
            this.setState({ page: 1 }, this.loadData);
        });
    }

    /**
     * @override
     */
    onColumnResize(field: string, width: number) {
        super.onColumnResize(field, width);
    }

    /**
     * Template for expanded rowsabox/processes-list
     */
    rowExpansionTemplate(data) {
        const Template = this.props.childTemplate;
        const id = (data && data[0].id) || 0; //  This is a shit way of getting the ID - FIX @Ian
        return <Template id={id} />;
    }

    /**
     *
     */
    toggleRow(event) {
        this.setState({ expandedRows: event.data });
        this.props.onRowToggle && this.props.onRowToggle(event);
    }

    /**
     *
     */
    onSelectionChange({ originalEvent, data }) {
        if (this.props.dataKey) {
            // without the data key the Primereact DataGrid is using ObjectUtils.equalsByValue to compare the Object
            // because ObjectUtils.equalsByValue is trying to set the property _$visited during the compare
            // and because our data is Immutable this will produce the error:
            // TypeError: Cannot add property _$visited, object is not extensible
            this.setState({ selection: data });

            if (this.props.onSelectionChange) {
                this.props.onSelectionChange({ originalEvent, data });
            }
        }
    }

    onRowClick = ({ data, index, originalEvent }) => {
        if (originalEvent.shiftKey && this.lastClickedRow >= 0) {
            if (this.lastClickedRow < index) {
                const selected = this.props.value.slice(this.lastClickedRow, index + 1);
                this.onSelectionChange({ originalEvent, data: selected });
            }
        } else {
            this.lastClickedRow = index;
        }

        if (this.props.onRowClick) {
            this.props.onRowClick({ data, index, originalEvent });
        }
    };

    buildDataTableContainerStyle = memoize(height => ({ height: (height || `calc(100% - 113px)`) }));

    buildDataTableSubContainerStyle = memoize(minWidth => ({ minWidth }));

    dataTableWrapperStyle = { height: '100%', overflow: 'auto', maxWidth: '100%' };

    getFilters = memoize(settings => ({ ...(settings.filters || {}) }));

    getSort = memoize(settings => [...(settings.sort || [])]);

    renderDataTableHeader() {
        const { settings } = this.state;
        const { globalFilter } = settings || {};
        const {
            SubDataTable,
            renderDataTableHeader,
            disableGlobalFilter,
            disableCountdown,
            isLoading,
            noRefresh,
            disableExport,
            downloadAll,
            isDownloading,
            showMenuButton,
            toggleMenu
        } = this.props;
        const props = {
            onGlobalSearch: disableGlobalFilter ? null : globalFilter && this.onGlobalSearch,
            globalSearchValue: get(globalFilter, 'value'),
            toggleSettings: this.toggleSettings,
            disableCountdown: disableCountdown || isLoading,
            countdownSeconds: 180,
            refreshAction: !noRefresh && this.loadData,
            exportData: disableExport ? null : this.exportDataTable,
            downloadAll: downloadAll,
            isDownloading: isDownloading,
            showMenuButton: showMenuButton,
            toggleMenu: toggleMenu,
        };
        if (renderDataTableHeader) {
            return renderDataTableHeader(props);
        }
        if (!SubDataTable) {
            return (<DataTableHeader {...props} />);
        }
        return null;
    }

    /**
     * @override
     */
    render(): Object {
        const {
            savePreferences,
            isLoading,
            height,
            columnDefinitions, // eslint-disable-line no-unused-vars
            loadRows, // eslint-disable-line no-unused-vars
            totalRecords,
            noRefresh,
            SubDataTable,
            disableGlobalFilter,
            disableCountdown,
            disableExport,
            onSelectionChange, // eslint-disable-line no-unused-vars
            countMax,
            renderDataTableHeader,
            ...primeDataTableProps
        } = this.props;

        if (onSelectionChange && !this.props.dataKey) {
            throw new Error('You need to specify the property "dataKey" to enable the "onSelectionChange" listener');
        }
        if (this.props.selectionMode && !this.props.dataKey) {
            throw new Error(`You need to specify the property "dataKey" to enable the "selectionMode" "${this.props.selectionMode}"`);
        }

        const { selection, settings, page } = this.state;

        const columnComponents = this.buildColumnComponents();

        const minWidth = this.calculateMinWidth(columnComponents);
        const rectHeight = Number(get(this.state, 'rect.height'));
        const scrollHeight = `${rectHeight - (isBrowser ? 180 : 160)}px`;
        const sortField = get(this.state, 'settings.sort[0].field', 'null');
        const sortOrder = get(this.state, 'settings.sort[0].order', null);
        return (
            <div className={'data-table-wrapper'} style={this.dataTableWrapperStyle} ref={this.tableRef}>
                {isLoading && <Loader absolute />}
                { this.renderDataTableHeader() }
                <DataTableContainer className="data-table-container" style={this.buildDataTableContainerStyle(height)} innerRef={this.containerRef}>
                    <div style={this.buildDataTableSubContainerStyle(minWidth)}>
                        {
                            !!rectHeight &&
                            <StyledPrimeDataTable
                                sortField={sortField}
                                sortOrder={sortOrder}
                                scrollable={true}
                                scrollHeight={scrollHeight}
                                {...primeDataTableProps}
                                filters={this.getFilters(settings)}
                                multiSortMeta={this.getSort(settings)}
                                rows={settings.pageSize}
                                totalRecords={totalRecords}
                                key={this.state.gridKey}
                                onFilter={this.onFilter}
                                lazy
                                onLazyLoad={this.onLazyLoad}
                                sortMode="multiple"
                                chldTemplate={this.rowExpansionTemplate}
                                expandedRows={this.state.expandedRows}
                                onRowToggle={this.toggleRow}
                                onSelectionChange={this.onSelectionChange}
                                selection={selection}
                                onRowClick={this.onRowClick}
                            >
                                {columnComponents}
                            </StyledPrimeDataTable>
                        }
                    </div>
                </DataTableContainer>
                {
                    !SubDataTable &&
                    <Fragment>
                        {
                            Number.isFinite(totalRecords) &&
                            <DataTablePaginator
                                page={page}
                                pageSize={settings.pageSize}
                                totalRecords={totalRecords}
                                countMax={countMax}
                                onPageChange={this.changePage}
                            />
                        }
                        <DataTableColumnsSidebar
                            isOpen={this.state.settingsOpen}
                            toggle={this.toggleSettings}
                            onChange={this.setColumns}
                            columns={this.columns}
                            columnsState={this.state.settings.columns}
                            loadUserPreferences={savePreferences && this.restoreUserPreferences}
                            saveUserPreferences={savePreferences && this.saveUserPreferences}
                            resetUserPreferences={savePreferences && this.resetUserPreferences}
                        />
                    </Fragment>
                }
            </div>
        );
    }
}

export default connect(
    (state: Object, props: Object): Object => ({
        tablePreferences: get(state, `user.preferences.dataTable.${props.dataTableId}`),
        tableReduxState: get(state, `grid.state.${props.dataTableId}`),
    }),
    { saveDataTablePreferences, resetDataTablePreferences, saveDataTableState, showToastr },
)(DataTable);

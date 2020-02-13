/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DataTable as PrimeDataTable } from 'primereact/components/datatable/DataTable';
import memoize from 'memoize-one';

import styled from 'styled-components';
import Immutable from 'app/utils/immutable/Immutable';
import Loader from 'app/components/atoms/Loader/Loader';
import { debounce, shallowEquals } from 'app/utils/utils';
import CaretRenderer from 'app/components/molecules/Grid/Renderers/Caret/CaretRenderer';
import { get, set } from 'app/utils/lo/lo';
import { saveDataTablePreferences, resetDataTablePreferences } from 'store/actions/admin/usersActions';
import { saveDataTableState } from 'store/actions/grid/gridActions';
import { AbstractTable } from '../AbstractTable';
import DataTableHeader from '../common/DataTableHeader';
import DataTableColumnsSidebar from '../common/DataTableColumnsSidebar';
import { DataTableContainer } from '../DataTableStyle';
import { showToastr } from 'store/actions/app/appActions';

const StyledPrimeDataTable = styled(PrimeDataTable)`
    .ui-datatable-scrollable-body {
        max-height: calc(100% - 100px) !important;
    }
`;
/**
 * Displays data in tabular format.
 */
class TreeDataTable extends AbstractTable {

    static propTypes = {
        ...AbstractTable.propTypes,
        data: PropTypes.arrayOf(PropTypes.object),
        loadRows: PropTypes.func,
        disableExport: PropTypes.bool,
        disableExpandAll: PropTypes.bool,
    };

    static defaultProps = {
        disableExpandAll: false,
    };

    state: Object;
    columns: Object;
    gridStatus: Object;
    loadedChildrenNodes = new Set();
    isExpandAll = true;

    // $FlowFixMe
    tableRef = React.createRef();
    // $FlowFixMe
    containerRef = React.createRef();

    /**
     * @param props the Component's properties
     */
    constructor(props: Object): void {
        super(props);

        Object.entries(this.columns).forEach(([field, column]: any) => {
            this.columns[field] = { ...column, sortable: false };
        });

        this.state = Immutable({
            ...this.state,
            data: get(props, 'data', []),
            settingsOpen: false,
            gridKey: 0,
            selection: [],
            settings: {
                ...(this.state.settings || {}),
                openNodesMap: {}
            },
            forest: this.generateForest(this.props.data)
        });
    }

    /**
     * @override
     * @param prevProps the properties that the Component will receive.
     */
    componentDidUpdate(prevProps) {
        const { data, tablePreferences } = this.props;
        let changes = {};
        if (data !== prevProps.data) {
            changes.forest = this.generateForest(data);
        }
        if (tablePreferences !== prevProps.tablePreferences) {
            const pref = this.buildPreferences(this.props);
            changes = { ...changes, ...pref };
        }
        this.setState(changes);
    }

    setTableBounds = debounce(() => {
        this.setState({
            rect: this.tableRef.current && this.tableRef.current.getBoundingClientRect(),
            gridKey: this.state.gridKey + 1,
        });
    }, 300);

    /**
     * @override
     */
    componentDidMount() {
        this.loadData();
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
    }

    /**
     *
     */
    setLevel(nodes, level) {
        (nodes || []).forEach((node) => {
            node.level = level; // eslint-disable-line no-param-reassign
            this.setLevel(node.children, level + 1);
        });
    }

    /**
     *
     */
    generateForest = memoize((data) => {
        const itemsMap = (data || []).reduce((map, item) => {
            map[item.id] = { ...item }; // eslint-disable-line no-param-reassign
            return map;
        }, {});
        const roots = [];
        const openNodesMap = { ...(get(this.state, 'settings.openNodesMap') || {}) };
        Object.entries(itemsMap).forEach(([id, item]: any) => {
            const parentId = item.parentId;
            if (parentId && itemsMap[parentId]) {
                const parent = itemsMap[parentId];
                parent.children = parent.children || [];
                parent.children.push(item);
                item.parent = parent; // eslint-disable-line no-param-reassign
                openNodesMap[parentId] = !!openNodesMap[parentId];
            } else {
                roots.push(item);
            }
        });
        this.setState({
            settings: set(this.state.settings, 'openNodesMap', openNodesMap)
        });
        this.setLevel(roots, 0);
        return roots;
    });

    /**
     *
     */
    onSelectionChange = ({ originalEvent, data }: Object) => {
        const id = data && ((data[0] && data[0].id) || data.id);
        const openNodesMap = { ...(get(this.state, 'settings.openNodesMap') || {}) };
        openNodesMap[id] = !openNodesMap[id];
        this.setState({
            settings: {
                ...get(this.state, 'settings', {}),
                openNodesMap,
            },
            selection: this.props.dataKey ? data : [],
        });
        if (openNodesMap[id] && this.props.loadChildren && !this.loadedChildrenNodes.has(id)) {
            this.loadedChildrenNodes.add(id);
            this.props.loadChildren(id);
        }
    }

    /**
     *
     */
    pushVisibleNodes(data, nodes) {
        (nodes || []).forEach((node) => {
            if (node.id && (get(this.state, 'settings.openNodesMap') || {})[node.id] && node.children) {
                data.push({ ...node, isOpen: true });
                this.pushVisibleNodes(data, node.children);
            } else {
                data.push(node);
            }
        });
    }

    addCaret = memoize((columnsComponents) => {
        const FirstColumn = columnsComponents[0];
        if (FirstColumn) {
            const body = FirstColumn.props.body;
            const newBody = (rowData, column) => <CaretRenderer data={rowData}> {body(rowData, column)} </CaretRenderer>;
            columnsComponents = set(columnsComponents, '[0].props.body', newBody);
        }
        return columnsComponents;
    }, shallowEquals);

    expandCollapseAll = () => {
        const open = this.isExpandAll;
        const openNodesMap = { ...(get(this.state, 'settings.openNodesMap') || {}) };
        Object.keys(openNodesMap).forEach(key => openNodesMap[key] = open);
        this.setState({
            settings: set(this.state.settings, 'openNodesMap', openNodesMap)
        });
        this.isExpandAll = !open;
    };

    exportTreeData = () => {
        super.exportData();
    };

    buildQueryOptions() {
        const queryOptions = super.buildQueryOptions();
        const { settings } = this.state;
        const { pageSize } = settings || {};
        if (pageSize === -1) {
            return { ...queryOptions, page: null, pageSize: null };
        }
        return queryOptions;
    }

    loadData = debounce(() => {
        if (!this.state.freezeData && this.props.loadRows) {
            this.props.loadRows(this.buildQueryOptions());
        } else {
            this.setState({ freezeData: false });
        }
    }, 700);

    /**
     * @override
     */
    filter = (options: Object) => {
        return super.filter(options).then(() => {
            this.setState({ page: 1 }, this.loadData);
        });
    };

    onGlobalSearch(event: Object) {
        return super.onGlobalSearch(event).then(() => {
            this.setState({ page: 1 }, this.loadData);
        });
    }

    resetUserPreferences = () => {
        super.resetUserPreferences();
        this.setState({ page: 1 }, this.loadData);
    }

    restoreUserPreferences = () => {
        super.restoreUserPreferences();
        this.setState({ page: 1 }, this.loadData);
    }

    /**
     * @override
     */
    render(): Object {
        const { dataTableId, isLoading, height, disableExport, ...primeDataTableProps } = this.props;
        const { gridKey, forest, settings } = this.state;
        const filters = settings.filters || {};
        const { globalFilter } = settings;
        const selection = this.state.selection || [];
        const data = [];
        this.pushVisibleNodes(data, forest);
        const columnsComponents = this.addCaret(this.buildColumnComponents());
        const minWidth = this.calculateMinWidth(columnsComponents);
        const style = { height: (height || `calc(100% - 40px)`)};
        const rectHeight = Number(get(this.state, 'rect.height'));
        const scrollHeight = `${rectHeight-116}px`;
        return (
            <div className={'data-table-wrapper'} style={{height: '100%', overflow: 'auto', maxWidth: '100%'}} ref={this.tableRef}>
                { isLoading && <Loader absolute /> }
                <DataTableHeader
                    toggleSettings={this.toggleSettings}
                    expandChildren={this.expandCollapseAll}
                    isChildrenExpanded={!this.isExpandAll}
                    onGlobalSearch={globalFilter && this.onGlobalSearch}
                    globalSearchValue={get(globalFilter, 'value')}
                    disableCountdown={true}
                    disableExpandAll={this.props.disableExpandAll}
                    exportData={disableExport ? null : this.exportTreeData}
                />
                <DataTableContainer className="data-table-container" style={style} innerRef={this.containerRef}>
                    <div style={{ minWidth }}>
                        {
                            !!rectHeight &&
                            <StyledPrimeDataTable
                                key={gridKey}
                                scrollable={true}
                                scrollHeight={scrollHeight}
                                value={data}
                                {...primeDataTableProps}
                                filters={{ ...filters }}
                                onSelectionChange={this.onSelectionChange}
                                globalFilter={get(globalFilter, 'value')}
                                onFilter={this.onFilter}
                                sortMode="multiple"
                                selection={selection}
                            >
                                {columnsComponents}
                            </StyledPrimeDataTable>
                        }
                    </div>
                </DataTableContainer>
                <DataTableColumnsSidebar
                    isOpen={this.state.settingsOpen}
                    toggle={this.toggleSettings}
                    onChange={this.setColumns}
                    columns={this.columns}
                    columnsState={this.state.settings.columns}
                    saveUserPreferences={dataTableId && this.saveUserPreferences}
                    resetUserPreferences={dataTableId && this.resetUserPreferences}
                    loadUserPreferences={dataTableId && this.restoreUserPreferences}
                />
            </div>
        );
    }
}

export default connect(
    ( state, props ) => ({
        tablePreferences: get(state, `user.preferences.dataTable.${props.dataTableId}`),
        tableReduxState: get(state, `grid.state.${props.dataTableId}`),
    }),
    { saveDataTablePreferences, resetDataTablePreferences, saveDataTableState, showToastr },
)(TreeDataTable);

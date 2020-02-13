/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import { connect } from 'react-redux';
import { isBrowser } from 'react-device-detect';

import { ABOX_PROCESSES_DATA_TABLE } from 'app/config/dataTableIds';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import AboxExpandedProcessTemplate from 'app/components/ABox/AboxExpandedProcessTemplate';
import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import ProcessLinkRenderer from 'app/components/molecules/Grid/Renderers/Link/ProcessLinkRenderer';
import PriorityRenderer from 'app/components/molecules/Grid/Renderers/Priority/PriorityRenderer';
import ProgressRenderer from 'app/components/molecules/Grid/Renderers/Progress/ProgressRenderer';
import PageTemplate from 'app/components/templates/PageTemplate';
import ViewTemplate from 'app/components/templates/ViewTemplate';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import ProcessesCards from 'app/components/ABox/Process/ProcessesCards';
import { get } from 'app/utils/lo/lo';
import { loadProcesses, loadExpandedProcess, saveProcessPageView } from 'store/actions/abox/processActions';

/**
 *
 */
class ProcessesList extends PureComponent<Object> {

    /**
     * @const propTypes - describes the properties of the component
     * @const defaultProps - define the defaults values of the properties
     * @const columnDefinitions -definition for columns that we need to display in our grid
     */
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        isDownloading: PropTypes.bool.isRequired,
        records: PropTypes.array,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
    };

    columnDefinitions: Array<Object>;
    gridSettings = {
        pageSize: 10,
        sort: [{ field: 'createDate', order: -1 }],
        globalFilter: { value: '' },
    };

    /**
     * @param {Object} props - component's properties
     */
    constructor(props: Object) {
        super(props);
        this.columnDefinitions = [
            {
                header: '',
                field: '__none__',
                expander: true,
                exportable: false,
                filter: false,
                sortable: false,
                style: { width: '40px' },
            },
            {
                header: 'Process Name',
                field: 'name',
                bodyComponent: ProcessLinkRenderer,
            },
            {
                header: 'Process ID',
                field: 'id',
                type: 'number',
                bodyComponent: ProcessLinkRenderer,
                style: { width: '120px' },
            },
            { header: 'Process Type', field: 'processDefinition.name' },
            {
                header: 'Parent Process',
                field: 'status.initiatedBy.id',
                type: 'number',
                bodyComponent: ProcessLinkRenderer,
                bodyComponentProps: { field: 'status.initiatedBy.id' },
                style: { width: '140px' }
            },
            {
                header: 'Tasks',
                field: 'tasks',
                filter: false,
                sortable: false,
                renderValue: ({ value }) => value && value.length,
                style: { width: '100px' },
            },
            { header: 'Modified', field: 'status.lastUpdate', type: 'date' },
            { header: 'Created', field: 'createDate', type: 'date' },
            {
                header: 'Created By',
                field: 'createdBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: { imageProperty: 'createdBy.image', idProperty: 'createdBy.id', nameProperty: 'createdBy.name' },
            },
            { header: 'Organisation', field: 'businessKey' },
            {
                header: 'Progress',
                field: 'variables.progress',
                type: 'number',
                bodyComponent: ProgressRenderer,
                filter: false,
                sortable: false,
                style: {  textAlign: 'center', width: '100px' },
                renderValue: ({ value }) => value || 0,
            },
            {
                header: 'Priority',
                field: 'variables.priority',
                type: 'number',
                bodyComponent: PriorityRenderer,
                filter: false,
                sortable: false,
                style: { textAlign: 'center', width: '100px' },
                renderValue: ({ value }) => value || 3,
            },
            { header: 'Region', field: 'status.payload.maintenancesite.region', style: { width: '100px' } },
            {
                header: 'Affected Tenants',
                field: 'status.payload.maintenancesite.tenants',
                renderValue: ({ value, data }) => {
                    const selectedTenants = get(data, 'status.payload.selectedTenants') || [];
                    if (!value || !value.length) {
                        return null;
                    }
                    const affected = `${selectedTenants.length} / ${value.length}`;
                    return affected;
                },
                filter: false,
                sortable: false,
                style: { width: '160px' },
            },
            { header: 'FSE', field: 'status.payload.maintenancesite.fse_obj.display_name', style: { width: '100px' }, },
            { header: 'RTO', field: 'status.payload.maintenancesite.rto_obj.display_name', style: { width: '100px' }, },
            { header: 'SFOM', field: 'status.payload.maintenancesite.sfom_obj.display_name', style: { width: '100px' }, },
            { header: 'Site', field: 'status.payload.maintenancesite.new_ihs_id', style: { width: '100px' }, },
        ];
        (this: Object).rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    }

    /**
     * rowExpansionTemplate - description
     *
     * @param  {type} data description
     * @return {type}      description
     */
    rowExpansionTemplate = ({ id }) => {
        const { expanded } = this.props;
        return <AboxExpandedProcessTemplate data={get(expanded, `${id}.data`)} isLoading={get(expanded, `${id}.isLoading`)} />;
    };

    onRowExpand = ({ originalEvent, data }) => {
        const processId = data.id;
        const isLoading = get(this.props.expanded, `${processId}.isLoading`);
        if (processId && !isLoading) {
            this.props.loadExpandedProcess(processId);
        }
    }

    loadRows = (options: Object) => {
        const opts = produce(options, (draft) => { options.where.push({ field: 'endDate', op: 'is null' }); });
        return this.props.loadProcesses(opts);
    };

    toggleView = () => {
        const { saveProcessPageView, isCardView } = this.props;
        saveProcessPageView({ isCardView: !isCardView}, ABOX_PROCESSES_DATA_TABLE);
    }

    /**
     * @override
     */
    render(): Object {
        const { isCardView, isLoading, isDownloading, records, recordsCount, recordsCountMax } = this.props;
        return (
            <Fragment>
                {!isCardView && isBrowser
                    ? (
                        <PageTemplate
                            key={String(isCardView)}
                            title="A-Box"
                            icon="account-multiple"
                            actions={
                                isBrowser && <ButtonIcon icon={'view-list'} onClick={this.toggleView} />
                            }
                        >
                            <ContentArea>
                                <DataTable
                                    dataTableId={ABOX_PROCESSES_DATA_TABLE}
                                    savePreferences={true}
                                    gridSettings={this.gridSettings}
                                    columnDefinitions={this.columnDefinitions}
                                    loadRows={this.loadRows}
                                    isLoading={isLoading}
                                    isDownloading={isDownloading}
                                    disableCountdown={true}
                                    value={records}
                                    totalRecords={recordsCount}
                                    countMax={recordsCountMax}
                                    onRowExpand={this.onRowExpand}
                                    rowExpansionTemplate={this.rowExpansionTemplate}
                                    now={Date.now()} // we need this to load the data (async) in the rowExpansionTemplate
                                    dataKey="id"
                                    selectionMode="multiple"
                                />
                            </ContentArea>
                        </PageTemplate>
                    )
                    : (
                        <ViewTemplate
                            key={String(isCardView)}
                            title="A-Box"
                            icon="account-multiple"
                            actions={
                                isBrowser && <ButtonIcon icon={'table'} onClick={this.toggleView} />
                            }
                        >
                            <ProcessesCards />
                        </ViewTemplate>
                    )
                }
            </Fragment>
        );
    }
}

export default connect((state: Object) => ({
    isLoading: state.abox.list.isLoading,
    isDownloading: state.abox.list.isDownloading,
    records: state.abox.list.records,
    recordsCount: state.abox.list.count,
    recordsCountMax: state.abox.list.countMax,
    expanded: state.abox.expanded,
    isCardView: get(state, `user.preferences.pageView.${ABOX_PROCESSES_DATA_TABLE}.isCardView`),
}), { loadProcesses, loadExpandedProcess, saveProcessPageView })(ProcessesList);

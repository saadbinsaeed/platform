/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import history from 'store/History';
import { withRouter } from 'react-router';

import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import { get } from 'app/utils/lo/lo';
import EntityAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/EntityAvatarRenderer';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import ToolBar from 'app/components/molecules/ToolBar/ToolBar';
import styled from 'styled-components';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import ReloadCountdown from 'app/components/molecules/ReloadCountdown/ReloadCountdown';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

const DropdownStyle = styled(Dropdown)`
    background: transparent !important;
    border: none !important;
    .ui-inputtext {

    }
    .ui-dropdown-trigger {
        background: transparent;
        border: none;
        font-size: 24px;
    }
    .ui-dropdown-label, .ui-dropdown-trigger-icon {
        min-height: 24px;
        line-height: 24px;
        padding-top: 0;
        padding-bottom: 0;
        background: transparent !important;
        font-weight: bold !important;
        color: #4BB9D9;
    }
    .ui-dropdown-label:hover {
        color: #4BB9D9;
    }
    .ui-dropdown-items {
        padding: 0 !important;
        background: #393F4C;
    }
    .ui-dropdown-items-wrapper {
        max-height: none !important;
    }
    .ui-dropdown-item {
        min-height: 50px;
        padding: 15px !important;
        color: #fff;
        border-radius: 0;
    }
    .ui-dropdown-item:not(.ui-state-highlight):hover {
        background: rgba(30, 168, 207, 0.2) !important;
    }
`;

const IconWrapper = styled.div`
    display: flex;
    flex-direction: row;

`;

const InputText = styled.input`
    height: 100%;
    background: transparent;
    border: none;
    font-size: 16px;
    line-height: 24px;
    color: #fff;
    outline: none;
    ::placeholder {
        color: gray;
    }
`;

class DeleteActionRenderer extends PureComponent<Object, Object> {
    deleteRelation = (event: Event) => {
        event.stopPropagation();
        this.props.deleteRelation(this.props.data.id);
    };

    editRelation = (event: Event) => {
        event.stopPropagation();
        const { baseUri, data: { id }  } = this.props;
        history.push(`${baseUri}/${id}/edit`);
    };

    render() {
        if (!this.props.data) {
            return null;
        }
        return (
            <Fragment>
                <ButtonIcon icon="pencil" iconColor="white" onClick={this.editRelation} />
                <ButtonIcon icon="delete" iconColor="white" onClick={this.deleteRelation} />
            </Fragment>
        );
    }
}

/**
 * @class
 * Renders the grid that contains the Relations.
 */
class RelationshipsGrid extends PureComponent<Object, Object> {
    /**
     * @const propTypes - describes the properties of the Component
     */
    static propTypes = {
        entityId: PropTypes.string.isRequired,
        loadRows: PropTypes.func.isRequired,
        deleteRelationship: PropTypes.func.isRequired,
        dataTableId: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isDownloading: PropTypes.bool.isRequired,
        records: PropTypes.array,
        totalRecords: PropTypes.number,
        countMax: PropTypes.number,
        canEdit: PropTypes.bool.isRequired,
        isAdmin: PropTypes.bool.isRequired
    };

    static defaultProps = {
        loadParams: {},
        isLoading: false,
    };

    dataTableApi = null;

    //

    @bind
    @memoize()
    buildColumnDefinitions(canEdit, type1, type2, entityId, deleteRelationship, isAdmin){
        const nType2 = type2 === 'custom' ? 'customEntity' : type2;
        const columns = [
            {
                header: 'Relationship',
                field: 'relation',
                queryFields: ['relationDefinition.relation', 'relationDefinition.reverseRelation'],
                bodyComponent: EntityAvatarRenderer,
                bodyComponentProps: { type: 'custom', nameProperty: 'relation', idProperty: 'relationDefinition.id' },
                filterBuild: value => ({
                    or:
                        [
                            [
                                { field: 'relationDefinition.reverseRelation', op: '=', value },
                                { field: `${nType2}1.id`, op: '<>', value: entityId },
                            ],
                            [
                                { field: 'relationDefinition.relation', op: '=', value },
                                { field: `${nType2}2.id`, op: '<>', value: entityId },
                            ],
                        ],
                }),
                orderBuild: asc => ({
                    asc: asc,
                    where: [
                        { field: `${nType2}1.id`, op: '=', value: entityId, then: 'relationDefinition.reverseRelation' },
                        { field: `${nType2}2.id`, op: '=', value: entityId, then: 'relationDefinition.relation' },
                    ],
                }),
            },
            {
                header: 'Entity ID',
                field: 'entityId',
                queryFields: [`${nType2}1.id`, `${nType2}2.id`],
                type: 'number',
                bodyComponent: EntityAvatarRenderer,
                bodyComponentProps: {
                    showAvatar: false,
                    type: type2,
                    nameProperty: 'entityId',
                    idProperty: 'entityId',
                },
                filterMatchMode: '=',
                filterBuild: value => ({
                    or:
                        [
                            [
                                { field: `${nType2}1.id`, op: '=', value },
                                { field: `${nType2}1.id`, op: '<>', value: entityId },
                            ],
                            [
                                { field: `${nType2}2.id`, op: '=', value },
                                { field: `${nType2}2.id`, op: '<>', value: entityId },
                            ],
                        ],
                }),
                orderBuild: asc => ({
                    asc: asc,
                    where: [
                        { field: `${nType2}1.id`, op: '=', value: entityId, then: `${nType2}2.id` },
                        { field: `${nType2}2.id`, op: '=', value: entityId, then: `${nType2}1.id` },
                    ],
                }),
            },
            {
                header: 'Entity Name',
                field: 'entityName',
                queryFields: [`${nType2}1.name`, `${nType2}2.name`],
                bodyComponent: EntityAvatarRenderer,
                bodyComponentProps: {
                    type: type2,
                    nameProperty: 'entityName',
                    idProperty: 'entityId',
                    imageProperty: 'entityImage',
                },
                filterBuild: value => ({
                    or:
                        [
                            [
                                { field: `${nType2}1.name`, op: 'startsWith', value },
                                { field: `${nType2}1.id`, op: '<>', value: entityId },
                            ],
                            [
                                { field: `${nType2}2.name`, op: 'startsWith', value },
                                { field: `${nType2}2.id`, op: '<>', value: entityId },
                            ],
                        ],
                }),
                orderBuild: asc => ({
                    asc: asc,
                    where: [
                        { field: `${nType2}1.id`, op: '=', value: entityId, then: `${nType2}2.name` },
                        { field: `${nType2}2.id`, op: '=', value: entityId, then: `${nType2}1.name` },
                    ],
                }),
            },
            {
                header: 'Created by',
                field: 'createdBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'createdBy.id',
                    imageProperty: 'createdBy.image',
                    nameProperty: 'createdBy.name',
                },
            },
            {
                header: 'Created Date',
                field: 'createdDate',
                type: 'date',
            },
            {
                header: 'Modified by',
                field: 'modifiedBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'modifiedBy.id',
                    imageProperty: 'modifiedBy.image',
                    nameProperty: 'modifiedBy.name',
                },
            },
            {
                header: 'Modified Date',
                field: 'modifiedDate',
                type: 'date',
            },
        ];
        if (isAdmin) {
            columns.splice(1, 0, {
                header: 'Relationship Active',
                field: 'relationDefinition.customEntity.active',
                type: 'boolean',
                sortable: false,
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => (value ? 'Active' : 'Inactive'),
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '150px', textAlign: 'center' },
            });
        }
        if (nType2 !== 'process' && nType2 !== 'task') {
            columns.splice(3, 0, {
                header: 'Entity Active',
                field: 'entityActive',
                queryFields: [`${nType2}1.active`, `${nType2}2.active`],
                type: 'boolean',
                sortable: false,
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => (value ? 'Active' : 'Inactive'),
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '150px', textAlign: 'center' },
                filterMatchMode: '=',
                filterBuild: value => ({
                    or:
                        [
                            [
                                { field: `${nType2}1.active`, op: '=', value },
                                { field: `${nType2}1.id`, op: '<>', value: entityId },
                            ],
                            [
                                { field: `${nType2}2.active`, op: '=', value },
                                { field: `${nType2}2.id`, op: '<>', value: entityId },
                            ],
                        ],
                }),
            });
        }
        if (canEdit) {
            columns.push({
                header: 'Action',
                field: '__action__',
                bodyComponent: DeleteActionRenderer,
                bodyComponentProps: { deleteRelation: deleteRelationship, baseUri: `${this.props.baseUri}/${type2}` },
                style: { textAlign: 'center', width: '120px' },
                sortable: false,
                filter: false,
                exportable: false,
            });
        }
        return columns;
    };

    gridSettings = {
        pageSize: 10,
        filters: {},
        sort: [],
        globalFilter: {
            value: '',
            fields: ['entityName', 'entityId', 'relation', 'createdBy.name'],
            filterBuild: value => this.globalFilterBuilder(value)

        },
    };

    @bind
    @memoize()
    globalFilterBuilder(value) {
        const { type1, type2, entityId, isAdmin, canEdit, } = this.props;
        const colDef = this.buildColumnDefinitions(canEdit, type1, type2, entityId, this.deleteRelationship, isAdmin);
        const globalFilterQuery = [];
        (this.gridSettings.globalFilter.fields).forEach((globalField) => {
            (colDef || []).forEach((col) => {
                if (col.field === globalField && col.filterBuild){
                    if (globalField === 'entityId'){
                        globalFilterQuery.push(col.filterBuild(Number(value)));
                    } else {
                        globalFilterQuery.push(col.filterBuild(value));
                    }
                } else if (col.field === globalField) {
                    globalFilterQuery.push({
                        or:
                            [
                                [
                                    { field: `${globalField}`, op: 'startsWith', value },
                                    { field: `${type1}1.id`, op: '<>', value: entityId },
                                ],
                                [
                                    { field: `${globalField}`, op: 'startsWith', value },
                                    { field: `${type2}2.id`, op: '<>', value: entityId },
                                ],
                            ]
                    });
                }
            });
        });
        return { or: globalFilterQuery };
    };

    componentDidUpdate(prevProps: Object) {
        if (prevProps.type2 !== this.props.type2) {
            this.dataTableApi && this.dataTableApi.refresh();
        }
    }

    @bind
    onDataTableMount(dataTableApi: Object) {
        this.dataTableApi = dataTableApi;
    };

    @bind
    @memoize()
    normalizeRecords(records, entityId, type1, type2){
        return records.map((record) => {
            const relationType1 = get(record, 'relationDefinition.entityType1') || '';
            const isStraight = relationType1 === type1 && String(get(record, `${type2}2.id`)) !== entityId;
            return {
                ...record,
                relation: isStraight
                    ? get(record, 'relationDefinition.relation')
                    : get(record, 'relationDefinition.reverseRelation'),
                entityName: isStraight
                    ? get(record, `${type2}2.name`)
                    : get(record, `${type2}1.name`),
                entityImage: isStraight
                    ? get(record, `${type2}2.image`)
                    : get(record, `${type2}1.image`),
                entityId: isStraight
                    ? get(record, `${type2}2.id`)
                    : get(record, `${type2}1.id`),
                entityActive: isStraight
                    ? get(record, `${type2}2.active`)
                    : get(record, `${type2}1.active`),

            };
        });
    };

    @bind
    deleteRelationship(id: number) {
        return this.props.deleteRelationship(id).then((mbError) => {
            if (!(mbError instanceof Error)) {
                this.dataTableApi && this.dataTableApi.refresh();
            }
        });
    };

    @bind
    onDropdownChange(event: Object) {
        const { value } = event.target;
        const { baseUri } = this.props;
        history.push(`${baseUri}/${value}`);
    };

    /**
     * @override
     */
    render(): Object {
        const { isAdmin, canEdit, type2, dataTableId, loadRows, isLoading, isDownloading, records, entityId, type1 } = this.props;
        return (
            <ContentArea>
                <DataTable
                    onMount={this.onDataTableMount}
                    dataTableId={dataTableId}
                    savePreferences={true}
                    gridSettings={this.gridSettings}
                    columnDefinitions={this.buildColumnDefinitions(
                        canEdit,
                        type1,
                        type2,
                        entityId,
                        this.deleteRelationship,
                        isAdmin,
                    )}
                    loadRows={loadRows}
                    isLoading={isLoading}
                    isDownloading={isDownloading}
                    disableCountdown={true}
                    value={this.normalizeRecords(
                        records,
                        entityId,
                        type1,
                        type2,
                    )}
                    totalRecords={this.props.totalRecords}
                    countMax={this.props.countMax}
                    showMenuButton
                    toggleMenu={this.props.toggleMenu}
                    dataKey="id"
                    selectionMode="multiple"
                    key={dataTableId}
                    renderDataTableHeader={this.renderToolBar}
                />
            </ContentArea>
        );
    }

    @bind
    navigateToAdd(event: Object) {
        event.preventDefault();
        const { baseUri } = this.props;
        history.push(`${ baseUri }/add`);
    };

    @bind
    @memoize()
    renderToolBar({
        onGlobalSearch, globalSearchValue, toggleSettings, disableCountdown, countdownSeconds, refreshAction, exportData, downloadAll, isDownloading
    }){
        const { type2 } = this.props;
        const icons = [
            <ButtonIcon key="plus" icon="plus" onClick={ this.navigateToAdd } iconColor="white" size="md" />,
        ];
        if (refreshAction) {
            icons.push(<ReloadCountdown key="refresh" disableCountdown={ disableCountdown } seconds={ countdownSeconds } format="minutes" action={ refreshAction } />);
        }
        icons.push(<ButtonIcon key="settings" icon="settings" onClick={ toggleSettings } iconColor="white" size="md" />);
        if (exportData) {
            icons.push(<ButtonIcon
                key="download"
                loading={ isDownloading }
                icon="download"
                title={ downloadAll ? 'Exports all records' : 'Exports up to 1000 records' }
                iconColor="white"
                size="md"
                onClick={ exportData }
            />);
        }
        return (
            <ToolBar
                leftSide={
                    <DropdownStyle
                        name={ 'entityType' }
                        value={ type2 }
                        options={[
                            { value: 'thing', label: 'THINGS' },
                            { value: 'person', label: 'PEOPLE' },
                            { value: 'organisation', label: 'ORGANISATIONS' },
                            { value: 'custom', label: 'CUSTOM ENTITIES' },
                            { value: 'process', label: 'PROCESSES' },
                            { value: 'task', label: 'TASKS' },
                        ]}
                        onChange={ this.onDropdownChange }
                    />
                }
                rightSide={
                    (icons && icons.length) &&
                    <IconWrapper>
                        { icons }
                    </IconWrapper>
                }
            >
                { onGlobalSearch && (
                    <InputText value={ globalSearchValue } onChange={ onGlobalSearch } type="search" placeholder="Search..." />
                )}
            </ToolBar>
        );
    }
}

export default withRouter(RelationshipsGrid);

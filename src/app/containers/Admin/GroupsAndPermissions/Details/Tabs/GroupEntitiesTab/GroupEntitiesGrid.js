/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import memoize from 'fast-memoize';

import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import {
    loadGroupEntities,
    selectEntities,
    removeGroupEntity, UPDATE_PERMISSIONS,
} from 'store/actions/admin/groupsActions';
import LabelListRenderer from 'app/components/molecules/Grid/Renderers/LabelListRenderer/LabelListRenderer';
import { GROUP_ENTITIES_DATA_TABLE } from 'app/config/dataTableIds';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import { get } from 'app/utils/lo/lo';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import { loadClassificationsDropDownForGrid } from 'store/actions/grid/gridActions';
import ClassificationsRenderer from 'app/components/molecules/Grid/Renderers/ClassificationsRenderer/ClassificationsRenderer';
import { bind } from 'app/utils/decorators/decoratorUtils';

const ButtonStyle = styled.div`
    display: flex;
    justify-content: center;
`;

/**
 * Container that is used to display the the grid of selected entity.
 */
class GroupEntitiesGrid extends PureComponent<Object, Object> {
    static propTypes = {
        groupId: PropTypes.string.isRequired,
        toggleMenu: PropTypes.func.isRequired,
        showMenuButton: PropTypes.bool.isRequired,
        selectEntities: PropTypes.func.isRequired,
        selectedEntities: PropTypes.array,
        entityType: PropTypes.oneOf([
            'thing',
            'person',
            'organisation',
            'custom',
            'proc_def',
        ]).isRequired,
        removeGroupEntity: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        isDownloading: PropTypes.bool,
        records: PropTypes.array,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
        userProfile: PropTypes.object,
    };

    static defaultProps = {
        selectedEntities: [],
        isLoading: false,
        isDownloading: false,
        records: [],
        recordsCount: 0,
        recordsCountMax: 0,
    };

    key: number = 0;

    canEdit: boolean = false;

    columnDefinitions: Object[];

    gridSettings = {
        pageSize: 10,
        filters: {},
        sort: [],
        globalFilter: { value: '' },
    };

    constructor(props: Object) {
        super(props);
        const { permissions, isAdmin } = props.userProfile;
        const permissionsSet = new Set(permissions || []);
        this.canEdit =
            this.props.groupId !== 1 &&
            (isAdmin || permissionsSet.has('admin.group.edit'));
        this.loadClassificationDropDown();
    }

    /**
     * @override
     */
    componentDidMount() {
        this.props.selectEntities([]);
    }

    loadClassificationDropDown = () => {
        if (this.props.entityType !== 'proc_def') {
            this.props.loadClassificationsDropDownForGrid({
                filterBy: [
                    { field: 'active', op: '=', value: true },
                    {
                        field: 'applicableOn',
                        op: '=',
                        value: this.props.entityType,
                    },
                ],
            });
        }
    };

    /**
     * This function will be used to build column definitions
     */

    buildColumnDefinitions: Function = memoize(
        (entityType, isAdmin, classifications) => {
            const nameField = {
                thing: 'thing.name',
                person: 'person.name',
                organisation: 'organisation.name',
                custom: 'customEntity.name',
                proc_def: 'processDefinitionEntity.name',
            }[entityType];
            const activeField = {
                thing: 'thing.active',
                person: 'person.active',
                organisation: 'organisation.active',
                custom: 'customEntity.active',
            }[entityType];
            const idField = {
                thing: 'thing.id',
                person: 'person.id',
                organisation: 'organisation.id',
                custom: 'customEntity.id',
                proc_def: 'processDefinitionEntity.id',
            }[entityType];
            const classificationField = {
                thing: 'thing.classes.uri',
                person: 'person.classes.uri',
                organisation: 'organisation.classes.uri',
                custom: 'customEntity.classes.uri',
            }[entityType];
            const classesField = {
                thing: 'thing.classes',
                person: 'person.classes',
                organisation: 'organisation.classes',
                custom: 'customEntity.classes',
            }[entityType];
            const columnDefinitions = [
                {
                    header: 'ID',
                    field: idField,
                    type: entityType === 'proc_def' ? 'text' : 'number',
                },
                {
                    header: 'Name',
                    field: nameField,
                    style: { width: '220px' },
                },
                {
                    header: 'Permissions',
                    field: 'permissions',
                    bodyComponent: LabelListRenderer,
                    renderValue: ({ data }) =>
                        (get(data, 'permissions') || [])
                            .map(permission => permission)
                            .join(', '),
                    filter: false,
                    sortable: false,
                },
            ];
            if (classificationField) {
                columnDefinitions.push({
                    header: 'Classifications',
                    field: classificationField,
                    filterMatchMode: '=',
                    sortable: false,
                    bodyComponent: props => (
                        <ClassificationsRenderer
                            {...props}
                            valueField={classesField}
                            label={'name'}
                            redirectTo={entityType}
                            idField={idField}
                        />
                    ),
                    renderValue: ({ data }) =>
                        data &&
                        (data.classes || []).map(({ name }) => name).join(', '),
                    options: (classifications || []).map(({ name, uri }) => ({
                        value: uri,
                        label: name,
                    })),
                    style: { width: '360px' },
                });
            }
            if (isAdmin && activeField) {
                columnDefinitions.push({
                    header: 'Active',
                    field: activeField,
                    type: 'boolean',
                    sortable: false,
                    bodyComponent: BooleanRenderer,
                    bodyComponentProps: { isTrue: value => value === true },
                    renderValue: ({ value }) =>
                        value === true ? 'Active' : 'Inactive',
                    options: [
                        { label: 'All', value: '' },
                        { label: 'Active', value: true },
                        { label: 'Inactive', value: false },
                    ],
                    style: { width: '100px', textAlign: 'center' },
                });
            }
            if (this.canEdit) {
                columnDefinitions.push({
                    header: 'Action',
                    field: '__action__',
                    bodyComponent: params => (
                        <ButtonStyle>
                            <ButtonIcon
                                style={{ color: 'white' }}
                                icon="delete"
                                onClick={() => {
                                    this.removeEntity(params.data);
                                }}
                            />
                        </ButtonStyle>
                    ),
                    style: { width: '80px' },
                    filter: false,
                    sortable: false,
                    exportable: false,
                });
            }
            return columnDefinitions;
        },
    );

    /**
     * componentDidUpdate - description
     *
     * @param  {type} prevProps: Object description
     * @return {type}                   description
     */
    componentDidUpdate(prevProps: Object) {
        const { lastActionType, entityType } = this.props;
        if (entityType !== prevProps.entityType) {
            this.resetSelectedRow();
            this.loadClassificationDropDown();
        }
        if (UPDATE_PERMISSIONS === lastActionType) {
            this.resetSelectedRow();
        }
    }

    @bind
    resetSelectedRow(){
        ++this.key;
        this.props.selectEntities([]);
    }

    /**
     * @param selectedRows the selected rows.
     */
    @bind
    onSelectionChange(selectedRows: Object) {
        this.props.selectEntities(selectedRows.data);
    };

    /**
     * Remove the specified entity from the group.
     *
     * @param data entity data.
     */
    @bind
    removeEntity({ id }: Object = {}) {
        this.props.removeGroupEntity(id).then(() => {
            ++this.key;
            this.props.selectEntities([]);
        });
    };

    /**
     *
     */
    @bind
    loadRows(options: Object) {
        const {
            groupId,
            entityType,
            userProfile: { isAdmin },
        } = this.props;
        return this.props.loadGroupEntities(
            groupId,
            entityType,
            options,
            isAdmin,
        );
    };

    /**
     * @override
     */
    render() {
        if (!this.props.groupId || !this.props.entityType) {
            return <PageNotAllowed title="Groups and Permissions" />;
        }
        return (
            <DataTable
                key={this.key}
                dataTableId={`${GROUP_ENTITIES_DATA_TABLE}/${
                    this.props.entityType
                }`}
                savePreferences
                columnDefinitions={this.buildColumnDefinitions(
                    this.props.entityType,
                    this.props.userProfile.isAdmin,
                    this.props.classifications,
                )}
                loadRows={this.loadRows}
                gridSettings={this.gridSettings}
                isLoading={
                    this.props.isLoading || (this.props.entityType !== 'proc_def' && this.props.classificationsLoading)
                }
                isDownloading={this.props.isDownloading}
                disableCountdown
                value={this.props.records}
                name={`group_${this.props.entityType}`}
                totalRecords={this.props.recordsCount}
                countMax={this.props.recordsCountMax}
                selection={this.props.selectEntities}
                dataKey={'id'}
                selectionMode="multiple"
                onSelectionChange={this.onSelectionChange}
                showMenuButton={this.props.showMenuButton}
                toggleMenu={this.props.toggleMenu}
            />
        );
    }
}

export default connect(
    (state, ownProps) => {
        const entity = {
            thing: 'things',
            person: 'people',
            organisation: 'organisations',
            custom: 'customEntities',
            proc_def: 'processDefinitions',
        }[ownProps.entityType];

        const mustHave = {
            selectedEntities: state.admin.groups.group.selectedEntities,
            userProfile: state.user.profile,
            lastActionType: state.global.lastActionType,
        };

        if (entity) {
            const entityData = get(state.admin.groups, entity) || {};
            return {
                classificationsLoading:
                    state.grid.dropdowns.classifications.isLoading,
                classifications: state.grid.dropdowns.classifications.records,
                isLoading: entityData.isLoading,
                isDownloading: entityData.isDownloading,
                records: entityData.records,
                recordsCount: entityData.count,
                recordsCountMax: entityData.countMax,
                ...mustHave,
            };
        }
        return mustHave;
    },
    {
        loadGroupEntities,
        removeGroupEntity,
        selectEntities,
        loadClassificationsDropDownForGrid,
    },
)(GroupEntitiesGrid);

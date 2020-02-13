/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import { GROUP_CLASSIFICATIONS_DATA_TABLE } from 'app/config/dataTableIds';
import { selectClasses, loadGroupClasses, removeGroupEntity, UPDATE_PERMISSIONS } from 'store/actions/admin/groupsActions';
import LabelListRenderer from 'app/components/molecules/Grid/Renderers/LabelListRenderer/LabelListRenderer';
import { get } from 'app/utils/lo/lo';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import GroupTabEdit from 'app/containers/Admin/GroupsAndPermissions/Details/GroupTabEdit';
import { bind } from 'app/utils/decorators/decoratorUtils';

const ButtonStyle = styled.div`
    display: flex;
    justify-content: center;
`;

/**
 * Container that is used to display the Classification tab of the Groups & Permissions details view.
 */
class GroupClassificationsTab extends PureComponent<Object, Object> {
    static propTypes = {
        lastActionType: PropTypes.string,
        lastActionError: PropTypes.bool,
        loadGroupClasses: PropTypes.func.isRequired,
        group: PropTypes.object,
        selectedClasses: PropTypes.array,
        removeGroupEntity: PropTypes.func.isRequired,
        selectClasses: PropTypes.func.isRequired,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
        groupClasses: PropTypes.array,
        groupClassesCount: PropTypes.number,
        groupClassesCountMax: PropTypes.number,
        isLoading: PropTypes.bool,
        userProfile: PropTypes.object.isRequired,
    };

    static defaultProps = {
        isLoading: false,
    };

    gridSettings: Object;

    key: number = 0;

    columnDefs: Object[];

    canEdit: boolean;

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);

        this.state = { visible: false };
        this.gridSettings = {
            pageSize: 10,
            filters: {},
            fields: [],
            globalFilter: { value: '' },
        };

        const { permissions, isAdmin } = props.userProfile;
        const permissionsSet = new Set(permissions || []);
        this.canEdit = isAdmin || permissionsSet.has('admin.group.edit');
        this.columnDefs = [
            {
                header: 'Classification Name',
                field: 'classification.name',
                renderValue: ({ value, data }) => `${value} (${String(get(data, 'classification.name') || '')})`,
            },
            {
                header: 'Classification URL',
                field: 'classification.uri',
                renderValue: ({ data }) => get(data, 'classification.uri'),
            },
            {
                header: 'Permissions',
                field: 'permissions',
                filter: false,
                sortable: false,
                bodyComponent: LabelListRenderer,
                renderValue: ({ value }) => (value || []).join(', '),
            },
            {
                header: 'Parent',
                field: 'classification.parents.name',
                filter: false,
                sortable: false,
                bodyComponent: ({ data }) => <LabelListRenderer
                    data={data}
                    value={(get(data, 'classification.parents') || []).map(({ name }) => name)}
                />,
                renderValue: ({ data }) => (get(data, 'classification.parents') || []).map(({ name }) => name)
                    .join(', '),
            },
            {
                header: 'Applies To',
                field: 'classification.applicableOn',
                filter: false,
                sortable: false,
                bodyComponent: LabelListRenderer,
                renderValue: ({ value }) => (value || []).join(', '),
            },
        ];
        if (isAdmin) {
            this.columnDefs.push({
                header: 'Active',
                field: 'classification.active',
                type: 'boolean',
                sortable: false,
                bodyComponent: BooleanRenderer,
                bodyComponentProps: { isTrue: value => value === true },
                renderValue: ({ value }) => value === true ? 'Active' : 'Inactive',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '100px', textAlign: 'center' },
            });
        }
        if (this.canEdit) {
            this.columnDefs.push({
                header: 'Action',
                field: '__action__',
                bodyComponent: ({ data }) => (
                    <ButtonStyle>
                        <ButtonIcon
                            style={{ color: 'white' }}
                            icon="delete"
                            onClick={() => {
                                this.removeClassification(data);
                            }}
                        />
                    </ButtonStyle>
                ),
                style: { width: '80px' },
                filter: false,
                exportable: false,
                sortable: false,
            });
        }
        this.resetSelectedClasses();
    }

    /**
     * componentDidUpdate - description
     *
     * @param  {type} prevProps: Object description
     * @return {type}                   description
     */
    componentDidUpdate(prevProps: Object) {
        const { lastActionType, selectClasses } = this.props;
        if (lastActionType === UPDATE_PERMISSIONS) {
            ++this.key;
            selectClasses([]);
        }
    }

    /**
     * This function will keep track of the count of selected rows in a grid
     */
    @bind
    onSelectionChanged(event: Object) {
        const selectedRows = event.data;
        this.props.selectClasses(selectedRows);
    };

    /**
     * This function will reset the selected classes
     */
    @bind
    resetSelectedClasses() {
        this.props.selectClasses([]);
    };

    /**
     * Remove the specified entity from the group.
     *
     * @param data the Class URI.
     */
    @bind
    removeClassification({ id }: Object = {}) {
        this.props.removeGroupEntity(id, 'classification').then(() => {
            ++this.key;
            this.resetSelectedClasses();
        });
    };

    @bind
    loadRows(options) {
        const groupId = this.props.match.params.id;
        if (groupId) {
            return this.props.loadGroupClasses(groupId, options, this.props.userProfile.isAdmin);
        }
    };

    @bind
    showDialog() {
        this.setState({ visible: true });
    };

    @bind
    closeDialog() {
        this.setState({ visible: false });
    };

    /**
     * @override
     */
    render() {
        const groupId = get(this.props.match.params, 'id');
        const group = this.props.group || {};
        const { selectedClasses } = this.props;
        return (
            <Fragment>
                <ContentArea>
                    <DataTable
                        key={this.key}
                        dataTableId={GROUP_CLASSIFICATIONS_DATA_TABLE}
                        savePreferences={true}
                        gridSettings={this.gridSettings}
                        loadRows={this.loadRows}
                        columnDefinitions={this.columnDefs}
                        isLoading={this.props.isLoading}
                        disableCountdown={true}
                        value={this.props.groupClasses}
                        totalRecords={this.props.groupClassesCount}
                        countMax={this.props.groupClassesCountMax}
                        selection={this.props.selectedClasses}
                        dataKey={'classification.id'}
                        selectionMode="multiple"
                        onSelectionChange={this.onSelectionChanged}
                    />
                </ContentArea>
                <FooterBar>
                    <div>
                        {group.id !== 1 && this.canEdit &&
                        <TextIcon label="Add" icon="plus" color="primary" to={`${this.props.match.url}/add`}/>}
                        {group.id !== 1 && this.canEdit && selectedClasses && selectedClasses.length > 0 && (
                            <TextIcon
                                label="Edit"
                                count={selectedClasses.length}
                                icon="pencil"
                                color="secondary"
                                onClick={this.showDialog}
                            />
                        )}
                    </div>
                    <GroupTabEdit groupId={groupId} selectedRow={selectedClasses} open={this.state.visible} closeDialog={this.closeDialog} />
                </FooterBar>
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        lastActionType: state.global.lastActionType,
        lastActionError: state.global.lastActionError,
        group: state.admin.groups.group.details,
        userProfile: state.user.profile,
        isLoading: state.admin.groups.group.isLoading,
        groupClasses: state.admin.groups.group.classes.records,
        groupClassesCount: state.admin.groups.group.classes.count,
        groupClassesCountMax: state.admin.groups.group.classes.countMax,
        selectedClasses: state.admin.groups.group.selectedClasses,
    }),
    { loadGroupClasses, removeGroupEntity, selectClasses },
)(GroupClassificationsTab);

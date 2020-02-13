/* @flow */

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import memoize from 'memoize-one';

import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import { GROUPS_DATA_TABLE } from 'app/config/dataTableIds';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import TreeDataTable from 'app/components/molecules/DataTable/DataTableClient/TreeDataTable';
import PageTemplate from 'app/components/templates/PageTemplate';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { loadGroups, deleteGroup, DELETE_GROUP } from 'store/actions/admin/groupsActions';
import { cut } from 'app/utils/string/string-utils';

const DeleteActionRenderer = ( { data, deleteFunc }: Object ) => {
    if (!data) {
        return null;
    }
    const element = (
        <div>
            <ButtonIcon icon="delete" iconColor="white" onClick={() => { deleteFunc(data.id); }} />
        </div>
    );
    return element;
};

const GroupLinkRenderer = ( { data }: Object ) => {
    if (!data) {
        return null;
    }
    const value = data.name || '';
    const displayName = cut(value, 25, true);
    return <Link to={`/groups/${encodeURIComponent(data.id)}/general`} title={value}>{ displayName }</Link>;
};

/**
 * Shows the Groups grid view.
 */
class GroupsList extends PureComponent<Object, Object> {

    static propTypes = {
        loadGroups: PropTypes.func.isRequired,
        deleteGroup: PropTypes.func.isRequired,
        lastActionType: PropTypes.string,
        lastActionError: PropTypes.bool,
        groups: PropTypes.array,
        isLoading: PropTypes.bool.isRequired,
        userProfile: PropTypes.object.isRequired,

    };
    static defaultProps = {};

    columnDefs: Object[];
    key: number = 0;

    /**
     * @param props the Component's properties
     */
    constructor(props) {
        super(props);
        this.columnDefs = [
            {
                header: 'Group Name',
                field: 'name',
                bodyComponent: GroupLinkRenderer,
                style: { width: '300px' },
            },
            {
                header: 'Category',
                field: 'category',
            },
            {
                header: 'Active',
                field: 'active',
                sortable: false,
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => value ? 'Active' : 'Inactive',
                options: [{ label: 'All', value: '' }, { label: 'Active', value: true }, { label: 'Inactive', value: false }],
                style: { width: '100px', textAlign: 'center' },
                type: 'boolean',
            },
            {
                header: 'Users',
                field: '_usersCount',
                style: { width: '100px', textAlign: 'center' },
                filter: false,
            },
            {
                header: 'Entities',
                field: '_entitiesCount',
                style: { width: '100px', textAlign: 'center' },
                filter: false,
            },
            {
                header: 'Classifications',
                field: '_classificationsCount',
                style: { width: '120px', textAlign: 'center' },
                filter: false,
            },
            {
                header: 'Create Date',
                field: 'createdDate',
                type: 'date',
            },
            {
                header: 'Modified Date',
                field: 'modifiedDate',
                type: 'date',
            },
            {
                header: 'Created By',
                field: 'createdBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: { idProperty: 'createdBy.id', imageProperty: 'createdBy.image', nameProperty: 'createdBy.name' },
            },
            {
                header: 'Modified By',
                field: 'modifiedBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: { idProperty: 'modifiedBy.id', imageProperty: 'modifiedBy.image', nameProperty: 'modifiedBy.name' },
            },
        ];
        const { permissions, isAdmin } = props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('admin.group.edit');
        if (canEdit) {
            this.columnDefs.push({
                header: 'Action',
                field: '__action__',
                bodyComponent: DeleteActionRenderer,
                bodyComponentProps: { deleteFunc: this.props.deleteGroup },
                style: { textAlign: 'center', width: '100px' },
                filter: false,
                exportable: false,
            });
        }
    }

    gridSettings = {
        pageSize: -1,
        filters: {},
        sort: [],
        globalFilter: { value: '', filterMatchMode: 'contains' },
    };


    /**
     *
     */
    componentDidUpdate(prevProps: Object) {
        const { lastActionType, lastActionError } = this.props;
        if (!lastActionError && [ DELETE_GROUP ].indexOf(lastActionType) >= 0) {
            this.props.loadGroups();
            ++this.key;
        }
    }

    getData = memoize(groups => groups.map(group => ({
        ...group,
        parentId: group.parent && group.parent.id,
        _entitiesCount: group._entitiesCount + group._processDefinitionsCount,
        createdBy: group.createdBy || { name: ''},
        modifiedBy: group.modifiedBy || { name: ''},
    })));

    loadRows = (options) => {
        return this.props.loadGroups({...options, pageSize: 1000});
    };

    /**
     * @override
     */
    render(): Object {

        return (
            <PageTemplate title={'Groups & Permissions'} >
                <ContentArea>
                    <TreeDataTable
                        dataTableId={GROUPS_DATA_TABLE}
                        savePreferences={true}
                        downloadAll={true}
                        gridSettings={this.gridSettings}
                        columnDefinitions={this.columnDefs}
                        isLoading={this.props.isLoading}
                        data={this.getData(this.props.groups)}
                        loadRows={this.loadRows}
                        selectionMode="single"
                        dataKey="id"
                        name="group_list"
                        metaKeySelection={false}
                    />
                </ContentArea>
            </PageTemplate>
        );
    }
}
export default connect(
    state => ( {
        lastActionType: state.global.lastActionType,
        lastActionError: state.global.lastActionError,
        groups: state.admin.groups.list.records,
        isLoading: state.admin.groups.list.isLoading,
        userProfile: state.user.profile,
    } ),
    { loadGroups, deleteGroup },
)(GroupsList);

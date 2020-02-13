/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Column } from 'primereact/components/column/Column';

import TreeTable from 'app/components/molecules/TreeTable/TreeTable';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import { loadAvailablePermissions, updateGroupPermissions } from 'store/actions/admin/groupsActions';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';

/**
 * Container that is used to display the Group and Permission tab details view.
 */
class GroupPermisionsTab extends PureComponent<Object, Object> {

    static propTypes = {
        loadAvailablePermissions: PropTypes.func.isRequired,
        updateGroupPermissions: PropTypes.func.isRequired,
        availablePermissions: PropTypes.array.isRequired,
        group: PropTypes.object,
        userProfile: PropTypes.object,
    };

    nodesMap = {};
    onDataAvailable = null;
    onDataAvailableResolve = (data) => {};

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);

        (this: Object).onSelectionChange = this.onSelectionChange.bind(this);
        (this: Object).onFormSubmit = this.onFormSubmit.bind(this);

        this.onDataAvailable = new Promise((resolve, reject) => {
            this.onDataAvailableResolve = resolve;
        }).then(({ group, availablePermissions }) => {
            const tableData = this.buildPermissionForest(availablePermissions);
            let selection = [];
            if (group && group.permissions) {
                selection = group.permissions.map(permission => ({ id: permission }));
                /*
                 * set the partial selected flag
                 */
                const selectionSet = new Set(group.permissions);
                Object.values(this.nodesMap).forEach((node: any) => {
                    if (!selectionSet.has(node.id)) {
                        return;
                    }
                    let parent = this.nodesMap[node.data.parent];
                    while (parent && !selectionSet.has(parent.id) && !parent.partialSelected) {
                        parent.partialSelected = true;
                        parent = this.nodesMap[parent.data.parent];
                    }
                });
            }
            this.setState({ tableData, selection });
        });

        const { group, availablePermissions } = this.props;
        if (group !== null && availablePermissions.length > 0) {
            this.onDataAvailableResolve({ group, availablePermissions });
        }
        this.state = { tableData: [], selection: null };
    }

    /**
     * @override
     */
    componentDidMount() {
        this.props.loadAvailablePermissions();
    }

    /**
     * next props
     */
    componentWillReceiveProps({ group, availablePermissions }) {
        if (group !== null && availablePermissions.length > 0) {
            this.onDataAvailableResolve({ group, availablePermissions });
        }
    }

    /**
     * on selection change
     */
    onSelectionChange({ originalEvent, selection }) {
        this.setState({ selection });
    }

    /**
     * data formated for treetable
     */
    buildPermissionForest(availablePermissions: Array<Object>) {
        const nodes = availablePermissions.map(({ name, displayName, description, parent } = {}) => ({
            id: name,
            data: { name, displayName, description, parent: parent && parent.name },
            leaf: true,
        }));
        this.nodesMap = {};
        nodes.forEach(node => this.nodesMap[node.data.name] = node); // eslint-disable-line no-return-assign
        nodes.forEach((node) => {
            if (node.data.parent) {
                const parent = this.nodesMap[node.data.parent];
                if (!parent) {
                    // eslint-disable-next-line no-console
                    console.log(`wrong data: parent "${parent}" not found.`);
                    return;
                }
                parent.leaf = false;
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
        });
        return nodes.filter((node: Object) => !node.data.parent);
    }

    /**
     * Save the group general info.
     *
     * @param event SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onFormSubmit(event: Object) {
        event.preventDefault();
        const { group } = this.props;
        const { selection } = this.state;
        this.props.updateGroupPermissions({
            id: group.id,
            permissions: selection && selection.map(item => item.id),
        });
    }

    /**
     * @override
     */
    render() {
        const group = this.props.group || {};
        const { tableData, selection } = this.state;
        const permissions = this.props.userProfile.permissions;
        const isAdmin = this.props.userProfile.isAdmin;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('admin.group.edit');
        return (
            <Fragment>
                <ContentArea>
                    <TreeTable value={tableData} selectionMode={group.id !== 1 && 'checkbox'} selection={selection} selectionChange={this.onSelectionChange}>
                        <Column field="displayName" header="Permission"></Column>
                        <Column field="description" header="Description"></Column>
                        <Column field="name" header="Path"></Column>
                    </TreeTable>
                </ContentArea>
                <FooterBar>
                    <div>
                        {group.id !== 1 && canEdit && <TextIcon icon="content-save" label="Save" onClick={this.onFormSubmit} color="primary" /> }
                    </div>
                </FooterBar>
            </Fragment>
        );
    }
}
export default withRouter( connect(
    state => ( {
        availablePermissions: state.admin.groups.group.availablePermissions,
        group: state.admin.groups.group.details,
        userProfile: state.user.profile,
    } ),
    { loadAvailablePermissions, updateGroupPermissions },
)( GroupPermisionsTab ) );

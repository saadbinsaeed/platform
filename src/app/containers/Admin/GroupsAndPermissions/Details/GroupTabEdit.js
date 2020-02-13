/* @flow */

/**
 * Renders the group classification tab header.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updatePermissions } from 'store/actions/admin/groupsActions';
import GroupPermissionsEdit from 'app/components/Admin/GroupsAndPermissions/GroupPermissionsEdit';
import Modal from 'app/components/molecules/Modal/Modal';

/**
 * Edit the permissions of the selected Group's entities.
 */
class GroupTabEdit extends Component<Object, Object> {
    static propTypes = {
        groupId: PropTypes.string.isRequired,
        selectedRow: PropTypes.array.isRequired,
        updatePermissions: PropTypes.func.isRequired,
        closeDialog: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired
    };

    /**
     * @override
     */
    render() {
        const { groupId, selectedRow, updatePermissions, closeDialog, open } = this.props;
        return (
            <Modal title="Edit Permissions" disableBack open={open} onToggle={closeDialog} >
                <GroupPermissionsEdit
                    groupId={groupId}
                    selectedItems={selectedRow}
                    savePermissions={updatePermissions}
                    closeDialog={closeDialog}
                />
            </Modal>
        );
    }
}

export default connect(null, { updatePermissions })(GroupTabEdit);

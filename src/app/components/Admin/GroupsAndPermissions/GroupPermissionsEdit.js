/* @flow */

/**
 * Renders the group classification tab header.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'app/components/atoms/Button/Button';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import Form from 'app/components/atoms/Form/Form';

import { handleChange } from 'app/utils/http/form';
import Immutable from 'app/utils/immutable/Immutable';

/**
 * Edit the permissions of the selected Group's classes.
 */
class GroupPermissionsEdit extends PureComponent<Object, Object> {

    static propTypes = {
        groupId: PropTypes.string.isRequired,
        selectedItems: PropTypes.array.isRequired,
        savePermissions: PropTypes.func.isRequired,
        closeDialog: PropTypes.func.isRequired,
    };

    state: Object = {
        form: Immutable({}),
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);
        (this: Object).onFormSubmit = this.onFormSubmit.bind(this);
        if (this.props.selectedItems.length === 1) {
            if (this.props.selectedItems[0].permissions) {
                this.state = {
                    updatingEntities: false,
                    form: {
                        read: (this.props.selectedItems[0].permissions.indexOf('read') !== -1 ),
                        assign: (this.props.selectedItems[0].permissions.indexOf('assign') !== -1 ),
                        edit: (this.props.selectedItems[0].permissions.indexOf('edit') !== -1 ),
                    }
                };
            }
        }
    }

    /**
     * @param event SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onFormSubmit(event: Object) {
        event.preventDefault();
        const { groupId, selectedItems, savePermissions } = this.props;
        if (!selectedItems || !selectedItems.length) {
            return;
        }
        const form = this.state.form;
        const permissions = Object.keys(form).filter( k => form[k] );
        const groupEntityIds = selectedItems.map(({ id }) => id);
        this.setState({ updatingEntities: true });
        savePermissions({ groupId, groupEntityIds, permissions: permissions.length ? permissions : null })
            .then(() => this.props.closeDialog())
            .catch(() => this.setState({ updatingEntities: false }));
    }

    /**
     * @override
     */
    render() {
        const { selectedItems, closeDialog } = this.props;
        const { updatingEntities = false } = this.state;
        if (!selectedItems || selectedItems.length === 0) {
            return <h1>Please select the items to edit</h1>;
        }
        const count = selectedItems.length;
        return (
            <Form onSubmit={this.onFormSubmit}>
                <div>
                    <Checkbox label="Edit" {...handleChange(this, 'edit', 'form', 'checked')} />
                    <Checkbox label="Read" {...handleChange(this, 'read', 'form', 'checked')} />
                    <Checkbox label="Assign" {...handleChange(this, 'assign', 'form', 'checked')} />
                </div>
                <br />
                <div>
                    <Button type="button" onClick={closeDialog}>Cancel</Button>
                    <Button type="submit" color="primary" disabled={updatingEntities}>Save</Button>
                    <span>  You are about to edit permissions for {count} {count === 1 ? 'item' : 'items'} </span>
                </div>
            </Form>
        );
    }
}

export default GroupPermissionsEdit;

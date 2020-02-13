/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from 'app/components/atoms/Button/Button';
import { createGroup } from 'store/actions/admin/groupsActions';
import Immutable from 'app/utils/immutable/Immutable';
import history from 'store/History';
import Form from 'app/components/atoms/Form/Form';
import Modal from 'app/components/molecules/Modal/Modal';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

/**
 * Renders the view to add Groups and Permissions.
 */
class GroupsAndPermissionsAdd extends Component<Object, Object> {

    static propTypes = {
        createGroup: PropTypes.func.isRequired,
        savingGroup: PropTypes.bool,
        userProfile: PropTypes.object,
    };

    state: Object = {
        data: Immutable({}),
    };

    formRef: Object = React.createRef();

    @bind
    @memoize()
    fieldDefinitions(isAdmin) {
        return [
            {
                field: 'name',
                type: 'text',
                properties: {
                    label: 'Group Name',
                    name: 'name',
                },
                constraints: {
                    required: true,
                    minLength: 3,
                    maxLength: 60,
                },
            },
            {
                field: 'category',
                type: 'text',
                properties: {
                    label: 'Category',
                    name: 'category',
                },
            },
            {
                field: 'parentId',
                type: 'groupTypeahead',
                properties: {
                    label: 'Parent',
                    name: 'parentId',
                    filterBy: isAdmin ? null : [{ field: 'active', op: '=', value: true }],
                    valueField: 'id'
                },
                condition: '=',
            },
        ];
    };

    @bind
    onFormSubmit(event: Object) {
        event.preventDefault();
        this.formRef.current.isValidForm().then(({ data, errors }) => {
            if (!errors) {
                this.props.createGroup(data);
            }
        });
    };

    /**
     * @override
     */
    render(): Object {
        const { savingGroup, userProfile: { permissions, isAdmin } } = this.props;
        const permissionsSet = new Set(permissions || []);
        const canAdd = isAdmin || permissionsSet.has('admin.group.add');
        if (!canAdd) {
            return <PageNotAllowed title="Group"/>;
        }

        return (
            <Modal title="Add a group" open>
                <Form loading={savingGroup}>
                    <FormGenerator
                        components={this.fieldDefinitions(isAdmin)}
                        ref={this.formRef}
                        ListItemProps={{
                            disableGutters: true
                        }}
                    />
                    <ModalFooter>
                        <Button type="button" onClick={history.pushBack}>Cancel</Button>
                        <Button onClick={this.onFormSubmit} type="submit" color="primary">Submit</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

export default connect(
    state => ({
        savingGroup: state.admin.groups.save.isLoading,
        userProfile: state.user.profile,
    }), { createGroup })(GroupsAndPermissionsAdd);

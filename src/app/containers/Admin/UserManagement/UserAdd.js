/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import Button from 'app/components/atoms/Button/Button';
import history from 'store/History';
import Form from 'app/components/atoms/Form/Form';
import { createUser } from 'store/actions/admin/userManagementAction';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import Modal from 'app/components/molecules/Modal/Modal';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

/**
 * Renders the view to add User Management.
 */
class UserAdd extends PureComponent<Object, Object> {

    static propTypes = {
        isLoading: PropTypes.bool,
        createUser: PropTypes.func.isRequired,
        userProfile: PropTypes.object.isRequired,
    };

    state: Object = {
        userToAdd: Immutable({})
    }

    formRef: Object = React.createRef();

    @bind
    @memoize()
    fieldDefinitions(isAdmin) {
        return [
            {
                field: 'login',
                type: 'text',
                properties: {
                    label: 'Login Id',
                    name: 'login',
                },
                constraints: {
                    required: true,
                    minLength: 3,
                    maxLength: 50,
                },
            },
            {
                field: 'name',
                type: 'text',
                properties: {
                    label: 'Name',
                    name: 'name',
                },
                constraints: {
                    required: true,
                    minLength: 3,
                    maxLength: 60,
                },
            },
            {
                field: 'partyId',
                type: 'text',
                properties: {
                    label: 'Email',
                    name: 'partyId',
                },
                constraints: {
                    required: true,
                    email: true,
                },
            },
            {
                field: 'employeeOf',
                type: 'organisationTypeahead',
                properties: {
                    label: 'Employee of',
                    name: 'employeeOf',
                    filterBy: isAdmin ? null : [{ field: 'active', op: '=', value: true }],
                    valueField: 'id',
                },
                constraints: {
                    required: true,
                },
            },
            {
                field: 'groups',
                type: 'groupTypeahead',
                properties: {
                    label: 'Groups',
                    name: 'groups',
                    filterBy: (groups) => {
                        const filterBy = [];
                        if (groups && groups.length) {
                            const modifiedGroups = groups.map(({ name }) => name);
                            filterBy.push(
                                { field: 'allChildren.name', op: 'not in', value: modifiedGroups },
                                { field: 'allParents.name', op: 'not in', value: modifiedGroups }
                            );
                        }
                        return filterBy;
                    } ,
                    multiple: true,
                },
            },
            {
                field: 'lang',
                type: 'customEntitiesTypeahead',
                properties: {
                    label: 'Language',
                    name: 'lang',
                    valueField: 'name',
                    placeholder: 'Select language...',
                    directoryType: 'languages',
                },
            },
        ];
    };

    @bind
    onFormSubmit(event: Object) {
        event.preventDefault();
        this.formRef.current.isValidForm().then(({ data, errors }) => {
            if (!errors) {
                this.props.createUser({
                    ...data,
                    groups: data.groups && data.groups.map(({ id }) => id),
                    employeeOf: get(data, 'employeeOf'),
                });
            }
        });
    };


    @bind
    handleChange(data: Object) {
        if (data.userid) {
            data = { ...data, userid: this._normalizeValue(data.userid) };
        }
        this.setState({ userToAdd: data });
    }


    @bind
    _normalizeValue(value: string) {
        if (value !== '') {
            return value.toLowerCase();
        }
    };

    render(): Object {
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canAdd = isAdmin || permissionsSet.has('admin.user.add');
        if (!canAdd) {
            return <PageNotAllowed title="User" />;
        }

        const { isLoading } = this.props;
        const { userToAdd } = this.state;

        return (
            <Modal title="Create New User" open>
                <Form loading={isLoading}>
                    <FormGenerator
                        components={this.fieldDefinitions(isAdmin)}
                        ref={this.formRef}
                        data={userToAdd}
                        onChange={this.handleChange}
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
    (state: Object, ownProps: Object): Object => ({
        isLoading: state.admin.users.user.isLoading,
        userProfile: state.user.profile,
    }), { createUser })(UserAdd);

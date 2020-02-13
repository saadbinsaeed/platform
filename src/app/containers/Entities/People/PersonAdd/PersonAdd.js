/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Form from 'app/components/atoms/Form/Form';
import Button from 'app/components/atoms/Button/Button';
import Modal from 'app/components/molecules/Modal/Modal';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import { savePerson } from 'store/actions/entities/peopleActions';
import history from 'store/History';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

/**
 * Renders the view to add a Person.
 */
class PersonAdd extends Component<Object, Object> {

    static propTypes = {
        savePerson: PropTypes.func,
        isLoading: PropTypes.bool,
        userProfile: PropTypes.object,
        person: PropTypes.object,
    };

    formRef: Object = React.createRef();

    @bind
    @memoize()
    fieldDefinitions(isAdmin) {
        return [
            {
                field: 'partyId',
                type: 'text',
                properties: {
                    label: 'Unique External Reference',
                    name: 'partyId',
                },
                constraints: {
                    maxLength: 60,
                },
            },
            {
                field: 'name',
                type: 'text',
                properties: {
                    label: 'Display Name',
                    name: 'name',
                },
                constraints: {
                    required: true,
                    minLength: 3,
                    maxLength: 60,
                },
            },
            {
                field: 'description',
                type: 'text',
                properties: {
                    label: 'Description',
                    name: 'description',
                },
            },
            {
                field: 'classes',
                type: 'classificationTypeahead',
                properties: {
                    label: 'Classification',
                    name: 'classes',
                    filterBy: isAdmin ? null : [{ field: 'active', op: '=', value: true }],
                    multiple: true,
                    applicableOn: 'person',
                },
            },
        ];
    };

    /**
     * Handle the form submit event.
     * @param e the form submit SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     * @returns {boolean} false.
     */
    @bind
    onFormSubmit(event: Event) {
        event.preventDefault();
        this.formRef.current.isValidForm().then(({ data, errors }) => {
            if (!errors) {
                this.props.savePerson(data).then((result) => {
                    const { id } = this.props.person || {};
                    if (id) {
                        history.push(`/people/${id}/`);
                    }
                });
            }
        });
    };

    /**
     * @override
     */
    render(): Object {
        const { isLoading } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canAdd = isAdmin || permissionsSet.has('entity.person.add');
        if (!canAdd) {
            return <PageNotAllowed title="People"/>;
        }

        return (
            <Modal title="Add person" open>
                <Form loading={isLoading} >
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
        userProfile: state.user.profile,
        isLoading: state.entities.people.save.isLoading,
        person: state.entities.people.save.data,
    }),
    { savePerson },
)(PersonAdd);

/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'app/components/atoms/Button/Button';
import Form from 'app/components/atoms/Form/Form';
import Field from 'app/components/molecules/Field/Field';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import Modal from 'app/components/molecules/Modal/Modal';

/**
 * Renders the form to a add a Thing
 */
class AddForm extends PureComponent<Object, Object> {

    static propTypes = {
        addForm: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        onSubtaskAdded: PropTypes.func,
    };

    state = {
        name: '',
        description: '',
    }

    onSubmit = ( e: Event ) => {
        e.preventDefault();
        const formData = { ...this.state };
        const { addForm, onFormAdded } = this.props;
        addForm(formData).then((response) => {
            if (response instanceof Error) return;
            const { id } = response;
            onFormAdded(id);
        });
    };

    onChange = (event: Object) => {
        const { name, value } = event.target || event;
        this.setState({ [name]: value });
    };

    /**
     * @override
     */
    render(): Object {
        const { isLoading, onClose, open } = this.props;
        const { name, description } = this.state;
        return (
            <Modal
                title="Add Form"
                open={open}
                onToggle={onClose}
            >
                <Form loading={isLoading} onSubmit={this.onSubmit}>
                    <Field
                        label="Name"
                        name="name"
                        value={name}
                        placeholder="Enter the name"
                        onChange={this.onChange}
                        required
                    />
                    <Field
                        label="Description"
                        name="description"
                        value={description}
                        placeholder="Enter the description"
                        onChange={this.onChange}
                    />
                    <ModalFooter>
                        <Button type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit" color="primary">Submit</Button>
                    </ModalFooter>
                </Form>
            </Modal>

        );
    }
}

export default AddForm;

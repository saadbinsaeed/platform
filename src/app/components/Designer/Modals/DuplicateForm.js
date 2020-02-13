/* @flow */
// $FlowFixMe
import React, { memo, useState } from 'react';
import { connect } from 'react-redux';

import Button from 'app/components/atoms/Button/Button';
import Form from 'app/components/atoms/Form/Form';
import Field from 'app/components/molecules/Field/Field';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import Modal from 'app/components/molecules/Modal/Modal';
import { get } from 'app/utils/lo/lo';
import { useOnChange, useReduxAction } from 'app/utils/hook/hooks';
import { cloneFormDefinition } from 'store/actions/designer/designerActions';

const DuplicateForm = ({ form, close, cloneFormDefinition, onDuplicate }) => {
    const [name, onNameChange] = useOnChange(get(form, 'name', ''));
    const [description, onDescriptionChange] = useOnChange(get(form, 'description', ''));
    const [isDuplicateDisabled, disableDuplicate] = useState(false);

    const duplicate = useReduxAction({
        action: cloneFormDefinition,
        parameters: [ form.id, { name, description } ],
        disableUI: disableDuplicate,
        onSuccess: () => {
            close && close();
            onDuplicate && onDuplicate();
        },
    });

    return (
        <Modal title="Duplicate form" open={true} onToggle={close}>
            <p>You need to give a name for the new form and you may want to add a description at the same time.</p>
            <Form>
                <Field
                    label="Name"
                    name="name"
                    value={name}
                    placeholder="Enter the name"
                    onChange={onNameChange}
                    required
                />
                <Field
                    label="Description"
                    name="description"
                    value={description}
                    placeholder="Enter the description"
                    onChange={onDescriptionChange}
                />
                <ModalFooter>
                    <Button type="button" onClick={close}>Cancel</Button>
                    <Button disabled={isDuplicateDisabled} onClick={duplicate} color="primary">Duplicate form</Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

export default connect(
    null,
    { cloneFormDefinition }
)(memo(DuplicateForm));

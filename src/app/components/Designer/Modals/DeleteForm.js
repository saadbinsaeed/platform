/* @flow */
// $FlowFixMe
import React, { memo, useState } from 'react';
import { connect } from 'react-redux';

import Button from 'app/components/atoms/Button/Button';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import Modal from 'app/components/molecules/Modal/Modal';
import { get } from 'app/utils/lo/lo';
import { deleteFormDefinition } from 'store/actions/designer/designerActions';
import { useReduxAction } from 'app/utils/hook/hooks';

const DeleteForm = ({ form, close, deleteFormDefinition, onDelete }) => {
    const [isDeleteDisabled, disableDelete] = useState(false);
    const onDeleteAction = useReduxAction({
        action: deleteFormDefinition,
        parameters: [ form.id ],
        disableUI: disableDelete,
        onSuccess: () => {
            close && close();
            onDelete && onDelete();
        },
    });

    return (
        <Modal title="Delete form" open={true} onToggle={close}>
            <p>Are you sure you want to delete the form "{get(form, 'name')}"?</p>
            <ModalFooter>
                <Button type="button" onClick={close}>Cancel</Button>
                <Button disabled={isDeleteDisabled} onClick={onDeleteAction} color="error">Delete form</Button>
            </ModalFooter>
        </Modal>
    );
};

export default connect(
    null,
    { deleteFormDefinition }
)(memo(DeleteForm));

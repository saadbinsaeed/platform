/* @flow */
// $FlowFixMe
import React, { memo, useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import produce from 'immer';

import Button from 'app/components/atoms/Button/Button';
import Form from 'app/components/atoms/Form/Form';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import Modal from 'app/components/molecules/Modal/Modal';
import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import { useReduxAction } from 'app/utils/hook/hooks';
import { shareFormDefinition } from 'store/actions/designer/designerActions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    MdiIcon,
    IconButton,
    Typography,
    Switch,
} from '@mic3/platform-ui';

const ShareForm = ({ form, close, shareFormDefinition, onShare }) => {
    const [share, setShareChange] = useState(form.share);
    const [isShareDisabled, disableShare] = useState(false);

    const shareAction = useReduxAction({
        action: shareFormDefinition,
        parameters: [ form.id, share ],
        disableUI: disableShare,
        onSuccess: () => {
            onShare && onShare();
        },
    });
    const changePermission = useCallback((userId, permission) => setShareChange(produce(share, (draftShare) => {
        draftShare.forEach((shareItem) => {
            if (shareItem.user.id === userId) {
                shareItem.permission = permission ? 1 : 0;
            }
        });
    })), [share]);
    const removeUser = useCallback(userId => setShareChange(share.filter(sh => sh.user.id !== userId)), [share]);
    const onShareUsers = useCallback((event) => {
        const newUser = event.target.value;
        setShareChange(produce(share, (draftShare) => {
            newUser[0] && draftShare.push({ user: newUser[0], permission: 1 });
        }));
    }, [setShareChange, share]);
    const usersFilterBy = useMemo(() => share.map(({ user }) => ({ field: 'id', op: '<>', value: user.id })), [share]);

    const usersTable = (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Shared with</TableCell>
                    <TableCell align="left">Can edit</TableCell>
                    <TableCell align="left">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {useCallback(share.map(({ user, permission }) => (
                    <TableRow key={user.name}>
                        <TableCell component="th" scope="row">
                            <Typography variant="body1"><MdiIcon name="account" />{user.name}</Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Switch onClick={event => changePermission(user.id, event.target.checked)} value={permission} />
                        </TableCell>
                        <TableCell align="left">
                            <IconButton onClick={() => removeUser(user.id)}><MdiIcon name="close" color="error" /></IconButton>
                        </TableCell>
                    </TableRow>
                )), [share])}
            </TableBody>
        </Table>
    );

    return (
        <Modal title="Share form" open={true} onToggle={close}>
            <p>You can decide who you wish to share this form with and if they can edit it.</p>
            <Form>
                <UserAutocomplete
                    name="users"
                    placeholder="Search for a user..."
                    onChange={onShareUsers}
                    value={[]}
                    filterBy={usersFilterBy}
                    multiple
                />
                {share.length ? usersTable : null}
                <ModalFooter>
                    <Button type="button" onClick={close}>Cancel</Button>
                    <Button disabled={isShareDisabled} onClick={shareAction} color="primary">Sharing form</Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

export default connect(
    null,
    { shareFormDefinition }
)(memo(ShareForm));

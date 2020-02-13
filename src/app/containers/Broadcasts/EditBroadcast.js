import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Ui
import Modal from 'app/components/molecules/Modal/Modal';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import BroadcastForm from './BroadcastForm';

/**
 * Create Broadcast
 */
class EditBroadcast extends PureComponent {

    static propTypes = {
        userProfile: PropTypes.object
    };
    /**
     * Render our create broadcast form
     */
    render() {
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('broadcast.edit');
        if (!canEdit) {
            return <PageNotAllowed title="Broadcast" />;
        }

        return (
            <Modal title="Edit Broadcast" open>
                <BroadcastForm {...this.props} />
            </Modal>
        );
    }
}

export default connect(
    state => ({
        userProfile: state.user.profile
    }), null)(EditBroadcast);

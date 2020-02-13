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
class CreateBroadcast extends PureComponent {

    static propTypes = {
        userProfile: PropTypes.object
    };
    /**
     * Render our create broadcast form
     */
    render() {
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canAdd = isAdmin || permissionsSet.has('broadcast.add');
        if (!canAdd) {
            return <PageNotAllowed title="Broadcast" />;
        }

        return (
            <Modal title="Create a new Broadcast" open>
                <BroadcastForm {...this.props} />
            </Modal>
        );
    }
}

export default connect(
    state => ({
        userProfile: state.user.profile
    }), null)(CreateBroadcast);

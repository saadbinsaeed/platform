/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CustomEntityAdd from 'app/components/Entities/CustomEntities/CustomEntityAdd';
import Modal from 'app/components/molecules/Modal/Modal';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import { saveCustomEntity } from 'store/actions/entities/customEntitiesActions';

/**
 * Renders the view to add a Custom Entity.
 */
class CustomEntityAddContainer extends Component<Object, Object> {
    static propTypes = {
        saveCustomEntity: PropTypes.func.isRequired,
        userProfile: PropTypes.object
    };

    /**
     * @override
     */
    render(): Object {
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canAdd = isAdmin || permissionsSet.has('entity.custom.add');

        if (!canAdd) {
            return <PageNotAllowed title="Custom Entity" />;
        }
        return (
            <Modal title="Add a custom entity" open>
                <CustomEntityAdd saveCustomEntity={this.props.saveCustomEntity} />
            </Modal>
        );
    }
}

export default connect(
    state => ({
        userProfile: state.user.profile
    }),
    { saveCustomEntity }
)(CustomEntityAddContainer);

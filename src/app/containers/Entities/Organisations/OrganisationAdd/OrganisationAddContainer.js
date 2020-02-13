/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import OrganisationAdd from 'app/components/Entities/Organisations/OrganisationAdd/OrganisationAdd';
import { saveOrganisation } from 'store/actions/entities/organisationsActions';
import Modal from 'app/components/molecules/Modal/Modal';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';

/**
 * Renders the view to add a Thing.
 */
class OrganisationAddContainer extends Component<Object, Object> {
    static propTypes = {
        saveOrganisation: PropTypes.func.isRequired,
        userProfile: PropTypes.object
    };

    /**
     * @override
     */
    render(): Object {
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canAdd = isAdmin || permissionsSet.has('entity.organisation.add');
        if (!canAdd) {
            return <PageNotAllowed title="Organisation" />;
        }
        return (
            <Modal title="Add Organisation" open>
                <OrganisationAdd saveOrganisation={this.props.saveOrganisation}/>
            </Modal>
        );
    }
}

export default connect(
    state => ( {
        userProfile: state.user.profile
    }), { saveOrganisation })(OrganisationAddContainer);

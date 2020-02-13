/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ThingAdd from 'app/components/Entities/Things/ThingAdd/ThingAdd';
import Modal from 'app/components/molecules/Modal/Modal';
import { saveThing } from 'store/actions/entities/thingsActions';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';

/**
 * Renders the view to add a Thing.
 */
class ThingAddContainer extends Component<Object, Object> {

    static propTypes = {
        saveThing: PropTypes.func.isRequired,
        userProfile: PropTypes.object
    };

    /**
     * @override
     */
    render(): Object {
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canAdd = isAdmin || permissionsSet.has('entity.thing.add');
        if (!canAdd) {
            return <PageNotAllowed title="Things" />;
        }
        return (
            <Modal title="Add Thing" open>
                <ThingAdd addThingFn={this.props.saveThing} />
            </Modal>
        );
    }
}

export default connect(state => ({
    userProfile: state.user.profile
}), { saveThing })(ThingAddContainer);

/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ClassificationAdd from 'app/components/Classifications/ClassificationAdd/ClassificationAdd';
import { createClassification } from 'store/actions/classifications/classificationsActions';
import Modal from 'app/components/molecules/Modal/Modal';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';

/**
 * Renders the view to add a Thing.
 */
class ClassificationAddContainer extends PureComponent<Object, Object> {

    static propTypes = {
        createClassification: PropTypes.func.isRequired,
        userProfile: PropTypes.object
    };


    /**
     * @override
     */
    render(): Object {
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canAdd = isAdmin || permissionsSet.has('entity.classification.add');
        if (!canAdd) {
            return <PageNotAllowed title="Classification" />;
        }
        return (
            <Modal title="Add Classification" open>
                <ClassificationAdd addClassificationFn={this.props.createClassification} />
            </Modal>
        );
    }
}

export default connect(
    state => ( {
        userProfile: state.user.profile
    }), { createClassification })(ClassificationAddContainer);

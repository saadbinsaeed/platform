/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import Designer from './Designer/Designer';

/**
 * Defines the routes for the Marketplace views
 */
class MarketplaceRoute extends Component<Object, Object> {

    static propTypes = {
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string }),
        userProfile: PropTypes.object,
        form: PropTypes.object,
        customComponent: PropTypes.object,
        forms: PropTypes.array,
        getAllForms: PropTypes.func,
        getForm: PropTypes.func,
        customComponents: PropTypes.array,
        getCustomFormComponents: PropTypes.func,
        getCustomFormComponent: PropTypes.func,

        createForm: PropTypes.func,
        updateForm: PropTypes.func,
        duplicateForm: PropTypes.func,
        deleteForm: PropTypes.func,

        createCustomFormComponent: PropTypes.func,
        updateCustomFormComponent: PropTypes.func,
        deleteCustomFormComponent: PropTypes.func,
        duplicateCustomFormComponent: PropTypes.func,

    };

    /**
     * @override
     */
    render() {
        const { match } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canView = isAdmin || permissionsSet.has('marketplace.designer1.view');
        if (!canView) {
            return <PageNotAllowed title="Affectli Designer" />;
        }
        return (
            <Switch>
                <Route path={`${ match.url }/designer`} exact component={Designer} />
            </Switch>
        );
    }
}

export default connect(
    state => ({
        userProfile: state.user.profile,
    }),
    { }
)(MarketplaceRoute);

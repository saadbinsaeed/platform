/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import FormDesigner from 'app/containers/Designer/Form/FormDesigner';
import Forms from 'app/containers/Designer/Forms';

/**
 * Defines the routes for the Designer views
 */
class DesignerRoute extends Component<Object, Object> {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    /**
     * @override
     */
    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route path={`${ match.url }/forms`} component={Forms} />
                {/* <Route path={`${ match.url }/form/add`} component={NewForm} /> */}
                <Route path={`${ match.url }/form/:id`} component={FormDesigner} />
                {/* <Route path={`${ match.url }/processes`} component={Processes} /> */}
                {/* <Route path={`${ match.url }/process/add`} component={NewProcess} /> */}
                {/* <Route path={`${ match.url }/process/:id`} component={Process} /> */}
                {/* <Route path={`${ match.url }/apps`} component={Apps} /> */}
                {/* <Route path={`${ match.url }/apps/add`} component={NewApp} /> */}
                {/* <Route path={`${ match.url }/app/:id`} component={App} /> */}
            </Switch>
        );
    }
}

export default DesignerRoute;

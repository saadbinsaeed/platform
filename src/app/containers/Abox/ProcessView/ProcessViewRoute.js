/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import ProcessRoute from 'app/containers/Abox/ProcessView/ProcessRoute';

/**
 * Abox Process Routes
 */
class ProcessViewRoute extends PureComponent<Object> {
    static propTypes = {
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string }),
    };

    /**
     * @override
     */
    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route path={`${match.url}/`} exact component={() => <Redirect to="/" />} />
                <Route path={`${match.url}/:id`} component={ProcessRoute} />
            </Switch>
        );
    }
}

export default ProcessViewRoute;

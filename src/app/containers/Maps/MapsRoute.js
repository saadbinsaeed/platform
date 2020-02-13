/* @flow */

// $FlowFixMe
import React, { Component, lazy } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import lazyComponent from 'app/utils/hoc/lazyComponent';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';

const SituationalAwareness = lazyComponent(lazy(() => import('app/containers/Maps/SituationalAwareness/SituationalAwareness')));

/**
 * Defines the routes for the Classification views
 */
class MapsRoute extends Component<Object, Object> {

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
                <Route path={`${ match.url }`} exact render={SituationalAwareness} />
            </Switch>
        );
    }
}

export default MapsRoute;

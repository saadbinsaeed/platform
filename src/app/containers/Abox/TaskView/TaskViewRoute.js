/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import TaskRoute from 'app/containers/Abox/TaskView/TaskRoute';
import { get } from 'app/utils/lo/lo';

/**
 * Define the routes for the Abox Task's views.
 */
class TaskViewRoute extends PureComponent<Object> {

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
                <Route path={`${match.url}/`} exact component={() => <Redirect to="/abox/tasks" />} />
                <Route path={`${match.url}/:id`} render={props => <TaskRoute {...props} key={String(get(props, 'match.params.id'))}  />} />
            </Switch>
        );
    }
}

export default TaskViewRoute;

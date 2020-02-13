/* @flow */

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { pure } from 'recompose';

import ProcessesList from 'app/containers/Abox/ProcessesList/ProcessesList';
import MyApps from 'app/containers/Abox/MyApps/MyApps';
import StartProcess from 'app/containers/Abox/MyApps/StartProcess';
import ProcessStarted from 'app/containers/Abox/MyApps/ProcessStarted';
import ProcessViewRoute from 'app/containers/Abox/ProcessView/ProcessViewRoute';
import TaskViewRoute from 'app/containers/Abox/TaskView/TaskViewRoute';
import AboxCalendar from 'app/containers/Abox/AboxCalendar/AboxCalendar';
import TaskList from 'app/containers/Abox/TaskList/TaskList';
import Timeline from 'app/containers/Abox/Timeline/Timeline';
import AddRelationshipNew from 'app/containers/Entities/Relationships/AddRelationshipNew';
import EditRelationship from 'app/containers/Entities/Relationships/EditRelationship';

/**
 * Define the routes for the Event's views.
 */
const AboxRoute = ({ match: { url } }: Object) => (
    <Switch>
        <Route path={`${url}/processes`} exact component={ProcessesList} />
        <Route path={`${url}/processes-new`} exact component={MyApps} />
        <Route
            path={`${url}/process/:entityId/relationships/add`}
            render={({ match: { params = {} } }) => (<AddRelationshipNew
                {...params}
                baseUri={`${url}/process/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                type1={'process'}
            />)}
        />
        <Route
            path={`${url}/process/:entityId/relationships/:type2/:id/edit`}
            render={({ match: { params = {} } }) => (<EditRelationship
                {...params}
                baseUri={`${url}/process/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                type1={'process'}
            />)}
        />
        <Route path={`${url}/process`} component={ProcessViewRoute} />
        <Route path={`${url}/process-start/:appId/:definitionKey`} exact component={StartProcess} />
        <Route path={`${url}/process-started/:processId`} exact component={ProcessStarted} />
        <Route path={`${url}/tasks`} exact component={TaskList} />

        <Route path={`${url}/tasks/:id`} exact component={
            // redirect for broken links affectli-project/affectli-support-issues#8270
            ({ match: { params: { id } } }) => <Redirect to={`${url}/task/${id}`}/>
        }/>
        <Route path={`${url}/tasks/:id/:tab`} exact component={
            // redirect for broken links affectli-project/affectli-support-issues#8270
            ({ match: { params: { id, tab } } }) => <Redirect to={`${url}/task/${id}/${tab}`}/>
        }/>

        <Route path={`${url}/calendar`} component={AboxCalendar} />
        <Route
            path={`${url}/task/:entityId/relationships/add`}
            render={({ match: { params = {} } }) => (<AddRelationshipNew
                {...params}
                baseUri={`${url}/task/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                type1={'task'}
            />)}
        />
        <Route
            path={`${url}/task/:entityId/relationships/:type2/:id/edit`}
            render={({ match: { params = {} } }) => (<EditRelationship
                {...params}
                baseUri={`${url}/task/${String(params.entityId)}/relationships`} // eslint-disable-line flowtype-errors/show-errors
                type1={'task'}
            />)}
        />
        <Route path={`${url}/task`} component={TaskViewRoute} />
        <Route path={`${url}/timeline`} exact component={Timeline} />
    </Switch>
);

export default pure(AboxRoute);

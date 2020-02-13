/* @flow */

import React from 'react';
import { pure } from 'recompose';
import { Grid, Row, Col } from 'react-styled-flexboxgrid';

import PageTemplate from 'app/components/templates/PageTemplate';
import ErrorBoundary from 'app/components/atoms/ErrorBoundary/ErrorBoundary';
import TasksAssignedToMeWidget from 'app/containers/Dashboards/Widgets/TasksAssignedToMeWidget';
import TasksOwnedByMeWidget from 'app/containers/Dashboards/Widgets/TasksOwnedByMeWidget';
import TasksImMemberWidget from 'app/containers/Dashboards/Widgets/TasksImMemberWidget';
import TasksDoneWidget from 'app/containers/Dashboards/Widgets/TasksDoneWidget';
import ProcessesOwnedByMeWidget from 'app/containers/Dashboards/Widgets/ProcessesOwnedByMeWidget';
import ProcessesAssignedToMeWidget from 'app/containers/Dashboards/Widgets/ProcessesAssignedToMeWidget';
import ProcessesMemberOfWidget from 'app/containers/Dashboards/Widgets/ProcessesMemberOfWidget';
import ProcessesDoneWidget from 'app/containers/Dashboards/Widgets/ProcessesDoneWidget';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';


/**
 * Renders the view to display the classification.
 */
const Dashboard = (props: Object) => (
    <PageTemplate title="Dashboard">
        <ContentArea>
            <Grid fluid style={{ paddingTop: '1.5rem' }}>
                <Row>
                    <Col xs={12} md={6} lg={3}>
                        <ErrorBoundary><TasksAssignedToMeWidget /></ErrorBoundary>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                        <ErrorBoundary><TasksOwnedByMeWidget /></ErrorBoundary>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                        <ErrorBoundary><TasksImMemberWidget /></ErrorBoundary>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                        <ErrorBoundary><TasksDoneWidget /></ErrorBoundary>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} lg={3}>
                        <ErrorBoundary><ProcessesAssignedToMeWidget /></ErrorBoundary>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                        <ErrorBoundary><ProcessesOwnedByMeWidget /></ErrorBoundary>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                        <ErrorBoundary><ProcessesMemberOfWidget /></ErrorBoundary>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                        <ErrorBoundary><ProcessesDoneWidget /></ErrorBoundary>
                    </Col>
                </Row>
            </Grid>
        </ContentArea>
    </PageTemplate>
);

export default pure(Dashboard);

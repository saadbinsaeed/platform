/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-styled-flexboxgrid';

import Container from 'app/components/atoms/Container/Container';
import Card from 'app/components/molecules/Card/Card';
import TaskAboutCard from 'app/containers/Abox/TaskView/AboutTab/TaskAboutCard';
import TaskDetailCard from 'app/containers/Abox/TaskView/AboutTab/TaskDetailCard';
import TaskScheduleCard from 'app/containers/Abox/TaskView/AboutTab/TaskScheduleCard';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
/**
 *
 */
class TaskAboutTab extends PureComponent<Object, Object> {

    static propTypes = {
        details: PropTypes.object,
        updateField: PropTypes.func.isRequired,
    };

    render() {
        const { details, updateField } = this.props;
        return (
            <ContentArea>
                <Container>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Card title="About" collapsible description={
                                <TaskAboutCard details={details} updateField={updateField} />
                            } />
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Card collapsible title="Task Detail" description={
                                <TaskDetailCard details={details} updateField={updateField} />
                            } />
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Card title="Schedule" collapsible description={
                                <TaskScheduleCard details={details} updateField={updateField} />
                            } />
                        </Col>
                    </Row>
                </Container>
            </ContentArea>
        );
    }
}

export default TaskAboutTab;

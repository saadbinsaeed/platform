/* @flow */

import { Col, Row } from 'react-styled-flexboxgrid';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import memoize from 'fast-memoize';

import Card from 'app/components/molecules/Card/Card';
import Container from 'app/components/atoms/Container/Container';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import Icon from 'app/components/atoms/Icon/Icon';
import Location from 'app/components/molecules/Map/Location/Location';
import RecentAttachments from 'app/components/RecentAttachments/RecentAttachments';
import Summary from 'app/components/molecules/Summary/Summary';
import { get, keyBy } from 'app/utils/lo/lo';
import { getSummaryElements } from 'app/utils/classification/classificationUtils';
import { loadCustomEntity } from 'store/actions/entities/customEntitiesActions';

/**
 * Render the Custom Entity's summary tab.
 */
class CustomEntitySummary extends Component<Object, Object> {

    static propTypes = {
        loadCustomEntity: PropTypes.func,
        customEntity: PropTypes.object.isRequired,
        recentAttachments: PropTypes.arrayOf(PropTypes.object),
    };

    constructor(props: Object) {
        super(props);
        props.loadCustomEntity(props.customEntity.id);
    };

    getSummary = memoize(structure => keyBy(getSummaryElements(structure), 'f_uri'));

    /**
     * @override
     */
    render() {
        const { customEntity, recentAttachments } = this.props;
        const latitude = get(customEntity, 'locationInfo.latitude');
        const longitude = get(customEntity, 'locationInfo.longitude');

        const iconInfo = { name: customEntity.iconName, color: customEntity.iconColor };
        return (
            <ContentArea>
                <Summary values={customEntity._summary} metadata={this.getSummary(customEntity._structure)} />
                <Container>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title="Location"
                                headerActions={<Link to={{ pathname: `/custom-entities/${customEntity.id}/about`, state: { scrollIntoView: true } }}><Icon name="window-maximize" size="sm" /></Link>}
                                description={<Location latitude={latitude} longitude={longitude} iconInfo={iconInfo} writeMode={false} />}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title="Recent Attachments"
                                headerActions={<Link to={`/custom-entities/${customEntity.id}/attachments`}><Icon name="window-maximize" size="sm" /></Link>}
                                description={<RecentAttachments recentAttachments={recentAttachments} />}
                            />
                        </Col>
                    </Row>
                </Container>
            </ContentArea>
        );
    }
}

const mapStateToProps = (state: Object) => ({
    customEntity: get(state.entities.customEntities.details.data, 'customEntity'),
    recentAttachments: get(state.entities.customEntities.details.data, 'recentAttachments'),
});

export default connect(mapStateToProps, { loadCustomEntity })(CustomEntitySummary);

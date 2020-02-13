/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-styled-flexboxgrid';
import { Link } from 'react-router-dom';
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
import { loadThing } from 'store/actions/entities/thingsActions';

/**
 * Render the Thing's summary tab.
 */
class ThingSummary extends PureComponent<Object, Object> {

    static propTypes = {
        thing: PropTypes.object.isRequired,
        recentAttachments: PropTypes.arrayOf(PropTypes.object),
        loadThing: PropTypes.func,
    };

    constructor(props) {
        super(props);
        props.loadThing(props.id);
    };

    getSummary = memoize(structure => keyBy(getSummaryElements(structure), 'f_uri'));

    /**
     * @override
     */
    render() {
        const { thing, recentAttachments } = this.props;
        if (!thing) {
            return null;
        }

        const latitude = get(thing, 'locationInfo.latitude');
        const longitude = get(thing, 'locationInfo.longitude');

        const iconInfo = { name: thing.iconName, color: thing.iconColor };
        return (
            <ContentArea>
                <Summary values={thing._summary} metadata={this.getSummary(thing._structure)} />
                <Container>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title="Location"
                                headerActions={<Link to={{ pathname: `/things/${thing.id}/about`, state: { scrollIntoView: true } }}><Icon name="window-maximize" size="sm" /></Link>}
                                description={<Location latitude={latitude} longitude={longitude} iconInfo={iconInfo} writeMode={false} />}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title="Recent Attachments"
                                headerActions={<Link to={`/things/${thing.id}/attachments`}><Icon name="window-maximize" size="sm" /></Link>}
                                description={<RecentAttachments recentAttachments={recentAttachments} />}
                            />
                        </Col>
                    </Row>
                </Container>
            </ContentArea>
        );
    }
}

const mapStateToProps = (state: Object, ownProps: Object) => ({
    id: ownProps.match.params.id,
    thing: get(state.entities.things.details.data, 'thing'),
    recentAttachments: get(state.entities.things.details.data, 'recentAttachments'),
});

export default connect(mapStateToProps, { loadThing })(ThingSummary);

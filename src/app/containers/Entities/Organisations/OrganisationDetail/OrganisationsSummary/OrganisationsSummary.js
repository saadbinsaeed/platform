/* @flow */

import { Col, Row } from 'react-styled-flexboxgrid';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import Card from 'app/components/molecules/Card/Card';
import ContactDetails from 'app/components/molecules/ContactDetails/ContactDetails';
import Container from 'app/components/atoms/Container/Container';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import Icon from 'app/components/atoms/Icon/Icon';
import Location from 'app/components/molecules/Map/Location/Location';
import RecentAttachments from 'app/components/RecentAttachments/RecentAttachments';
import Summary from 'app/components/molecules/Summary/Summary';
import Text from 'app/components/atoms/Text/Text';
import { get, keyBy } from 'app/utils/lo/lo';
import { getSummaryElements } from 'app/utils/classification/classificationUtils';

/**
 * Render the Organisations summary tab.
 */
class OrganisationsSummary extends PureComponent<Object, Object> {

    static propTypes = {
        organisation: PropTypes.object,
        loadOrganisation: PropTypes.func,
        recentAttachments: PropTypes.arrayOf(PropTypes.object),
    };

    constructor(props: Object) {
        super(props);
        props.loadOrganisation(props.organisation.id);
    };

    /**
     * @override
     */
    render(): Object {
        const { organisation, recentAttachments } = this.props;
        const iconInfo = { name: organisation.iconName, color: organisation.iconColor};
        const id = organisation.id;
        return (
            <ContentArea>
                <Summary values={organisation._summary} metadata={keyBy(getSummaryElements(organisation._structure), 'f_uri')} />
                <Container>
                    <Row>

                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title="Company Profile"
                                description={<Text overflowHidden>{organisation.description || 'There is no description available.'} </Text>}
                            />

                            <Card
                                title="Contact Details"
                                description={<ContactDetails contactInfo={organisation.contactInfo}> </ContactDetails>}
                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title="Location"
                                headerActions={<Link to={{ pathname: `/organisations/${id}/about`, state: { scrollIntoView: true } }}><Icon name="window-maximize" size="sm" /></Link>}
                                description={
                                    <Location
                                        latitude={get(organisation, 'locationInfo.latitude')}
                                        longitude={get(organisation, 'locationInfo.longitude')}
                                        writeMode={false}
                                        iconInfo={iconInfo}
                                    />
                                }
                            />
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title="Recent Attachments"
                                headerActions={<Link to={`/organisations/${id}/attachments`}><Icon name="window-maximize" size="sm" /></Link>}
                                description={<RecentAttachments recentAttachments={recentAttachments} />}
                            />
                        </Col>
                    </Row>
                </Container>
            </ContentArea>
        );
    }
}

export default OrganisationsSummary;

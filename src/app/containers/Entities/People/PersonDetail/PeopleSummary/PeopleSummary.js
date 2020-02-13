/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-styled-flexboxgrid';
import { Link } from 'react-router-dom';

import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Card from 'app/components/molecules/Card/Card';
import ContactDetails from 'app/components/molecules/ContactDetails/ContactDetails';
import Container from 'app/components/atoms/Container/Container';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import Location from 'app/components/molecules/Map/Location/Location';
import RecentAttachments from 'app/components/RecentAttachments/RecentAttachments';
import Summary from 'app/components/molecules/Summary/Summary';
import Text from 'app/components/atoms/Text/Text';
import { get, keyBy } from 'app/utils/lo/lo';
import { getSummaryElements } from 'app/utils/classification/classificationUtils';

/**
 * Render the People summary tab.
 */
class PeopleSummary extends PureComponent<Object, Object> {

    static propTypes = {
        person: PropTypes.object,
        loadPerson: PropTypes.func,
        recentAttachments: PropTypes.arrayOf(PropTypes.object),
    };

    constructor(props: Object) {
        super(props);
        props.loadPerson(props.person.id);
    };

    /**
     * @override
     */
    render(): Object {
        const { person, recentAttachments } = this.props;
        const id = person.id;
        const iconInfo = { name: person.iconName, color: person.iconColor};
        return (
            <ContentArea>
                <Summary values={person._summary} metadata={keyBy(getSummaryElements(person._structure), 'f_uri')} />
                <Container>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title={'Profile'}
                                description={<Text overflowHidden>{person.description || 'There is no description available.'} </Text>}
                            />
                            <Card
                                title="Contact Details"
                                description={<ContactDetails contactInfo={person.contactInfo}> </ContactDetails>}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title="Location"
                                headerActions={<Link to={{ pathname: `/people/${id}/about`, state: { scrollIntoView: true } }}><ButtonIcon icon="window-maximize" size="sm" /></Link>}
                                description={
                                    <Location
                                        latitude={get(person, 'locationInfo.latitude')}
                                        longitude={get(person, 'locationInfo.longitude')}
                                        writeMode={false}
                                        iconInfo={iconInfo}
                                    />
                                }
                            />
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <Card
                                title="Recent Attachments"
                                headerActions={<Link to={`/people/${id}/attachments`}><ButtonIcon icon="window-maximize" size="sm" /></Link>}
                                description={<RecentAttachments recentAttachments={recentAttachments} />}
                            />
                        </Col>
                    </Row>
                </Container>
            </ContentArea>
        );
    }
}

export default PeopleSummary;

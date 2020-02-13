/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-styled-flexboxgrid';
import styled from 'styled-components';
import memoize from 'memoize-one';

import Container from 'app/components/atoms/Container/Container';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Loader from 'app/components/atoms/Loader/Loader';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';
import ProcessLink from 'app/components/atoms/Link/ProcessLink';
import Card from 'app/components/molecules/Card/Card';
import ItemInfo from 'app/components/molecules/ItemInfo/ItemInfo';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import ProgressRenderer from 'app/components/molecules/Grid/Renderers/Progress/ProgressRenderer';
import ProcessDiagramCard from 'app/components/ABox/Cards/ProcessDiagramCard';
import Text from 'app/components/atoms/Text/Text';

import { setProcessPriority } from 'store/actions/abox/processActions';

import { formatDate } from 'app/utils/date/date';
import { isEmpty } from 'app/utils/utils';
import { get } from 'app/utils/lo/lo';
import { getNum } from 'app/utils/utils';
import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';

const Label = styled.strong`
`;

const RowStyled = styled.div`
padding: 1rem 0;
`;
const P = styled(Text)`
margin: 1rem 0;
display: block;
`;

const AboutCard = (props: Object) => {
    const { processDefinition, priority, businessKey, endDate } = props.data;
    const application = get(processDefinition, 'application');
    const { name, image, id, login } = get(application, 'createdBy') || {};
    return (
        <Fragment>
            <b>Description</b>
            <P>{(processDefinition && processDefinition.description) || 'None'}</P>
            <b>Company</b>
            <P>{businessKey || 'None'}</P>
            <b>Application Owner</b>
            <RowStyled>
                {
                    (application && id
                    && <ItemInfo
                        icon={<Avatar src={image} name={name} size="lg" />}
                        title={<PeopleLink id={id}>{name}</PeopleLink>}
                        subtitle={login}
                    />)
                    || 'None'
                }
            </RowStyled>
            <b>Application Name</b>
            <P>{(processDefinition && processDefinition.application && processDefinition.application.name) || 'None'}</P>
            <b>Definition Name</b>
            <P>{(processDefinition && processDefinition.name) || 'None'}</P>
            <b>Priority</b>
            <div title={endDate && 'Process is closed so you can not change the priority'}>
                <Dropdown
                    name="Priority"
                    placeholder="Select Priority"
                    onChange={props.changePriority}
                    value={priority}
                    disabled={endDate ? true : false}
                    options={PRIORITY_OPTIONS}
                />
            </div>
        </Fragment>
    );
};

/**
 *
 * @example <AboxProcessAboutTab />
 */
class ProcessAboutTab extends PureComponent<Object, Object> {
    static propTypes = {
        details: PropTypes.object,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        details: {},
        isLoading: false
    };
    properties: Array<Object>;

    /**
     * constructor - description
     *
     * @param  {type} props: Object description
     * @return {type}               description
     */
    constructor(props: Object) {
        super(props);
        const { createdBy, status, createDate, endDate } = props.details || {};
        const { image, name, id, login } = createdBy || {};
        const lastUpdate = get(status, 'lastUpdate');
        this.properties = [
            {
                label: 'Created By',
                component: createdBy && <ItemInfo
                    icon={<Avatar src={image} name={name} size="lg" />}
                    title={<PeopleLink id={id}>{name}</PeopleLink>}
                    subtitle={login}
                />
            },
            {
                label: 'Created Date',
                value: (createDate && formatDate(createDate)) || 'none'
            },
            {
                label: 'Last Modified Date',
                value: (lastUpdate && formatDate(lastUpdate)) || 'none'
            },
            {
                label: 'Status',
                value: !endDate ? 'Open' : 'Closed'
            }
        ];
    }

    /**
     * changePriority - description
     *
     * @param  {type} event: Object description
     * @return {type}               description
     */
    changePriority = (event: Object) => {
        const { details: { id }, setProcessPriority,  } = this.props;
        const priority = getNum(event, 'value');
        if(priority) {
            setProcessPriority(id, priority);
        };
    };

    buildAboutCardData = memoize((variables, processDefinition, businessKey, endDate) => ({
        priority: getNum(variables, 'priority', 3),
        processDefinition,
        businessKey,
        endDate,
    }));

    generatePropertiesItems(properties: ?Array<Object>) {
        return (properties || []).map(({ label, value, component }) => (
            <div key={label}>
                <b>{label}</b>
                <RowStyled>{component || value}</RowStyled>
            </div>
        ));
    }

    generatePropertiesCard = memoize(({ parent, properties }: Object) => (
        <Fragment>
            {
                parent &&
                <InputWrapper>
                    <Label>Parent Process</Label>
                    <ItemInfo
                        icon={
                            <ProgressRenderer
                                value={get(parent, 'variables.progress')}
                                data={{ endDate: get(parent, 'endDate'), variables: { priority: get(parent, 'variables.priority') } }}
                            />
                        }
                        title={<ProcessLink id={parent.id}>{parent.name || 'No Name'}</ProcessLink>}
                        subtitle={<em>#{parent.id}</em>}
                    />
                </InputWrapper>
            }
            <Fragment>{this.generatePropertiesItems(properties)}</Fragment>
        </Fragment>
    ));

    /**
     * @override
     */
    render(): Object {
        const { isLoading, details } = this.props;
        if (isLoading && isEmpty(details)) {
            return <Loader absolute />;
        }
        const { processDefinition, businessKey, endDate, variables, parent } = details;
        const aboutCardData = this.buildAboutCardData(variables, processDefinition, businessKey, endDate);
        return (
            <ContentArea>
                <Container>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Card title="About" collapsible description={<AboutCard data={aboutCardData} changePriority={this.changePriority} />} />
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Card collapsible title="Properties" description={<Fragment>{this.generatePropertiesCard({parent, properties: this.properties})}</Fragment>} />
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <Card collapsible title="Process Diagram" description={<ProcessDiagramCard processDefinition={processDefinition} />} />
                        </Col>
                    </Row>
                </Container>
            </ContentArea>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.abox.process.details.isLoading,
        details: state.abox.process.details.data,
    }),
    {
        setProcessPriority,
    }
)(ProcessAboutTab);

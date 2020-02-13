/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Container from 'app/components/atoms/Container/Container';
import Card from 'app/components/molecules/Card/Card';
import Loader from 'app/components/atoms/Loader/Loader';
import Icon from 'app/components/atoms/Icon/Icon';

import { get } from 'app/utils/lo/lo';
import { isEmpty, getStr } from 'app/utils/utils';
import { iconsSet } from 'app/utils/styles/mdi';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import ListItem from 'app/components/molecules/List/ListItem';
import ProgressRenderer from 'app/components/molecules/Grid/Renderers/Progress/ProgressRenderer';
import Tooltip from 'app/components/atoms/Tooltip/Tooltip';
import ProcessDiagramCard from 'app/components/ABox/Cards/ProcessDiagramCard';
import ProcessLink from 'app/components/atoms/Link/ProcessLink';

const Title = styled.strong`
margin-left: 0.5rem;
`;


const PropertiesCard = ({ process }: Object) => {
    const { id, name, processDefinition, variables } = process || {};
    const icon = getStr(processDefinition, 'deployedModel.modelData.icon', '');
    // $FlowFixMe
    const progress = Math.floor(get(variables, 'progress', 0));
    return (
        <Tooltip x={-80} y={0}>
            <Title>Parent Process</Title>
            <ListItem
                component={
                    <ProgressRenderer
                        alt={`${progress}%`}
                        value={progress}
                        data={process}
                        foreignObjectContent={
                            <Icon
                                hexColor={get(processDefinition, 'deployedModel.modelData.iconColor')}
                                name={icon && iconsSet.has(icon) ? icon : 'asterisk'}
                                size="md"
                            />
                        }
                    />
                }
                subTitle={`#${id}` || 'No ID'}
                title={<ProcessLink id={id}>{name || 'No Name'}</ProcessLink>}
            />
        </Tooltip>
    );
};

/**
 *
 */
class TaskProcessMapTab extends PureComponent<Object, Object> {
    static propTypes = {
        details: PropTypes.object,
        isLoading: PropTypes.bool,
    };

    /**
     * @override
     */
    render(): Object {
        const { isLoading, details } = this.props;
        if (isLoading || isEmpty(details)) {
            return <Loader absolute />;
        }
        const { process } = details;
        return (
            <ContentArea>
                <Container width="1024">
                    {process && <PropertiesCard
                        process={process}
                    />}
                    <Card
                        collapsible
                        title="Process Diagram"
                        descriptionPadding={false}
                        description={<ProcessDiagramCard processDefinition={get(process, 'processDefinition')} />} />
                </Container>
            </ContentArea>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.abox.task.isLoading,
        details: state.abox.task.details.data,
    }), null)(TaskProcessMapTab);

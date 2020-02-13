/* @flow */

import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import Hr from 'app/components/atoms/Hr/Hr';
import Icon from 'app/components/atoms/Icon/Icon';

import { iconsSet } from 'app/utils/styles/mdi';
import { get } from 'app/utils/lo/lo';


const CollapsedContent = styled.div`
${({ collapsed }) => collapsed ? 'display: none' : ''};
`;

const ProcessActionIcons = styled(Icon)`
display: inline-block;
vertical-align:top;
font-size: 1rem;
margin-top: -5px;
margin-left: 5px;
`;

const ProcessDescription = styled(CollapsedContent)`
font-size: .75rem;
margin-bottom: 10px;
width: 100%;
`;

const Italic = styled.span`
display: block;
font-style: italic;
font-size: 0.7rem;

& > a {
    color: white;
}
`;

const ProcessRow = styled.article`
display: flex;
justify-content: start;
overflow: hidden;
`;

const ProcessContent = styled.div`
flex: 3;
padding-left: 0.6rem;
overflow: hidden;
`;

const ProcessTitle = styled.h2`
margin: 0;
font-size: 0.9rem;
font-weight: normal;

overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
`;

const ProcessSubContent = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`;
const HrTyled = styled(Hr)`
margin-top: 0.6rem;
`;

/**
 *
 */
class MyAppCardProcess extends PureComponent<Object, Object> {

    state = { isDescriptionOpen: false };

    openProcess = () => this.props.openProcess(get(this.props, 'processDefinition.key'));

    toggleProcessDescription = () => {
        this.setState({ isDescriptionOpen: !this.state.isDescriptionOpen });
        this.props.updateCard();
    }

    toggleFavorite = () => {
        const { processDefinition } = this.props;
        this.props.toggleFavorite
            && this.props.toggleFavorite(get(processDefinition, 'key'), get(processDefinition, 'deployedModel.name'));
    }

    render() {
        const { processDefinition, isFavorite } = this.props;
        const { deployedModel, description } = processDefinition;
        const { isDescriptionOpen } = this.state;

        return (
            <Fragment>
                <ProcessRow>
                    <Icon
                        name={iconsSet.has(deployedModel.modelData.icon) ? deployedModel.modelData.icon : 'arrange-bring-to-front'}
                        onClick={this.openProcess}
                        size="md"
                        hexColor={deployedModel.modelData.iconColor}
                    />
                    <ProcessContent>
                        <ProcessTitle alt={deployedModel.name} >{deployedModel.name}</ProcessTitle>
                        <ProcessSubContent>
                            <Italic>Version {deployedModel.version}</Italic>
                            <div>
                                <ProcessActionIcons alt="Start process" color="success" name="play-circle" onClick={this.openProcess} size="sm" />
                                <ProcessActionIcons
                                    alt={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    name={isFavorite ? 'star' : 'star-outline'}
                                    onClick={this.toggleFavorite} size="sm" />
                                <ProcessActionIcons
                                    alt={isDescriptionOpen ? 'Close' : 'Description'}
                                    onClick={this.toggleProcessDescription}
                                    name={isDescriptionOpen ? 'close-circle-outline' : 'information'}
                                    size="sm"
                                />
                            </div>
                        </ProcessSubContent>
                    </ProcessContent>
                </ProcessRow>
                <ProcessDescription collapsed={!isDescriptionOpen}>
                    {description || 'No description.'}
                    <HrTyled/>
                </ProcessDescription>
            </Fragment>
        );
    }
};

export default MyAppCardProcess;

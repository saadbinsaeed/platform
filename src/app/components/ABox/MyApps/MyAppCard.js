/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import history from 'store/History';

import Tooltip from 'app/components/atoms/Tooltip/Tooltip';
import Link from 'app/components/atoms/Link/Link';
import Hr from 'app/components/atoms/Hr/Hr';
import Icon from 'app/components/atoms/Icon/Icon';
import { iconsSet } from 'app/utils/styles/mdi';
import { get } from 'app/utils/lo/lo';
import { cut } from 'app/utils/string/string-utils';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

import MyAppCardProcess from './MyAppCardProcess';


const CardContainer = styled.div`
background-color: ${({ theme }) => theme.widget.background};
color: ${({ theme }) => theme.widget.textColor};
box-shadow: ${({ theme }) => theme.shadow.z1};
border-radius: 3px;
`;

const CardHeader = styled.header`
background-color: ${({ theme, backgroundColor }) => backgroundColor || theme.widget.header.background};
color: ${({ theme }) => theme.widget.header.textColor};
padding: 0.2rem 0.6rem;
border-radius: ${({ collapsed }) => collapsed ? '3px' : '3px 3px 0 0' };
align-items: center;
`;

const CardContent = styled.div`
${({ collapsed }) => collapsed ? 'display: none' : ''};
padding: 0.6rem;
`;

const Card = (props: Object) => {
    const { header, children, collapsed, headerBackgroundColor} = props;
    return (
        <CardContainer>
            <CardHeader backgroundColor={headerBackgroundColor} collapsed={collapsed}>
                { header }
            </CardHeader>
            <CardContent collapsed={collapsed}>
                { children }
            </CardContent>
        </CardContainer>
    );
};

const HeaderContainer = styled.div`
display: grid;
align-items: center;
justify-content: left;
grid-template-columns: 1fr 6fr 1fr;
`;

const HeaderContent = styled.header`
padding: 0 0.3rem;

white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
text-align: left;
`;

const HeaderTitle = styled.div`
font-size: 1rem;
font-weight: bold;

overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
text-align: left;
`;

const HeaderSubTitle = styled.div`
font-size: 0.73rem;
font-style: italic;
`;

const HeaderActions = styled.div`
white-space: nowrap;
`;

const HeaderInfo = styled.div`
display: grid;
align-items: center;
justify-content: left;
grid-template-columns: 7fr 1fr;
padding: 0.6rem 0.6rem 0 0.6rem;
`;

const HeaderAppDescription = styled.div`
font-size: 0.85rem;
padding: 0 1rem;
`;

const CollapsedContent = styled.div`
${({ collapsed }) => collapsed ? 'display: none' : ''};
`;

const Italic = styled.span`
display: block;
font-style: italic;
font-size: 0.7rem;

& > a {
    color: white;
}
`;

/**
 * Renders the view to display the classification.
 */
class MyAppsCard extends PureComponent<Object, Object> {

    static propTypes = {
        app: PropTypes.object.isRequired,
        addToFavorites: PropTypes.func.isRequired,
        favoriteAppsPath: PropTypes.string.isRequired,
        favoriteProcessesPath: PropTypes.string.isRequired,
        favoriteApps: PropTypes.object,
        favoriteProcesses: PropTypes.object,
        collapsed: PropTypes.bool,
    }
    card: Object
    state: Object

    // $FlowFixMe
    elementRef = React.createRef();

    constructor(props: Object) {
        super(props);
        this.state = {
            isAppDescriptionOpen: false,
            isAppProcessesOpen: !props.collapsed,
        };
    }

    componentDidMount() {
        this.resizeGridItem();
    }

    componentDidUpdate(prevProps: Object, prevState: Object) {
        const { collapsed  } = this.props;
        if (collapsed !== prevProps.collapsed) {
            this.setState({
                isAppProcessesOpen: !collapsed,
                isAppDescriptionOpen: false,
            });
            this.updateCard();
        }
        if(prevProps.app !== this.props.app) {
            this.updateCard();
        }
    }
    
    @bind
    resizeGridItem() {
        if (!get(this.elementRef, 'current.firstChild')) {
            return;
        }
        const domElement = this.elementRef.current;
        const rowHeight = 60;
        const rowGap = 10;
        if(domElement) {
            const rowSpan = Math.ceil((domElement.firstChild.getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
            domElement.style.gridRowEnd = `span ${rowSpan}`;
        }
    }

    @bind
    updateCard() {
        setTimeout(this.resizeGridItem, 10);
    }

    @bind
    toggleAppDescription(e: Object) {
        const { isAppDescriptionOpen } = this.state;
        this.setState({ isAppDescriptionOpen: !isAppDescriptionOpen });
        this.updateCard();
    }

    @bind
    toggleAppProcesses(e: Object) {
        this.setState({
            isAppProcessesOpen: !this.state.isAppProcessesOpen,
        }, this.updateCard);
    }

    @bind
    toggleAppFavorite() {
        const { addToFavorites, favoriteAppsPath, app: { id, name } } = this.props;
        addToFavorites(favoriteAppsPath, id, name, true);
        this.updateCard();
    }

    @bind
    toggleProcessFavorite(processDefinitionKey: string, processDefinitionName: string) {
        const { addToFavorites, favoriteProcessesPath } = this.props;
        addToFavorites(favoriteProcessesPath, processDefinitionKey, processDefinitionName);
    }

    @bind
    openProcess(definitionKey: string) {
        history.push(`/abox/process-start/${this.props.app.id}/${definitionKey}`);
    };

    @bind
    @memoize()
    getProcesses(processesDefinitions: Array<Object>, favoriteProcesses: Set<string>): Array<Object> {
        const definitions: Array<Object> = [...processesDefinitions];
        return definitions
            .sort((a, b) => {
                const nameA = get(a, 'deployedModel.name') || '';
                const nameB = get(b, 'deployedModel.name') || '';
                // $FlowFixMe
                return nameA < nameB ? -1 : (nameA === nameB ? 0 : 1);
            })
            .map((processDefinition: Object, processIndex: number) => {
                const isFavorite = favoriteProcesses.has(processDefinition.key);
                return (
                    <MyAppCardProcess
                        key={processDefinition.key}
                        processDefinition={processDefinition}
                        isFavorite={isFavorite}
                        openProcess={this.openProcess}
                        toggleFavorite={this.toggleProcessFavorite}
                        updateCard={this.updateCard}
                    />
                );
            });
    };

    render(): Object {
        const { app, favoriteApps, favoriteProcesses } = this.props;
        const { name, createdBy, model, description, processesDefinitions, version, modifiedBy, modifiedDate, id } = app;
        const { icon, iconColor } = model;
        const { isAppDescriptionOpen, isAppProcessesOpen } = this.state;
        const isFavoriteApp = favoriteApps.has(id);
        return (
            <Tooltip innerRef={this.elementRef}>
                <Card
                    headerBackgroundColor={iconColor}
                    header={
                        <Fragment>
                            <HeaderContainer>
                                <Icon
                                    name={iconsSet.has(icon) ? icon : 'asterisk'}
                                    onClick={this.toggleAppDescription}
                                    size="lg"
                                />
                                <HeaderContent>
                                    <HeaderTitle alt={name} onClick={this.toggleAppDescription} >{name}</HeaderTitle>
                                    <HeaderSubTitle>{createdBy && createdBy.name}</HeaderSubTitle>
                                </HeaderContent>
                                <HeaderActions>
                                    <Icon
                                        name={isAppDescriptionOpen ? 'close-circle-outline' : 'information'}
                                        alt={isAppDescriptionOpen ? 'Close' : 'Description'}
                                        onClick={this.toggleAppDescription}
                                        size="sm"
                                    />
                                    <Icon name={isAppProcessesOpen ? 'arrow-up' : 'arrow-down'} size="sm" onClick={this.toggleAppProcesses} />
                                </HeaderActions>
                            </HeaderContainer>
                            <CollapsedContent collapsed={!isAppDescriptionOpen}>
                                <Hr/>
                                <HeaderInfo>
                                    <div>
                                        <Italic>Version: {version}</Italic>
                                        <Italic>
                                            {
                                                modifiedBy &&
                                                <Fragment>
                                                    Last Updated: {moment(modifiedDate).format('DD MMMM')}{' '}
                                                    by <Link to={`/user-management/${modifiedBy.login}`}>@{modifiedBy.name}</Link>
                                                </Fragment>
                                            }
                                        </Italic>
                                    </div>
                                    <Icon
                                        name={isFavoriteApp ? 'star' : 'star-outline'}
                                        onClick={this.toggleAppFavorite}
                                        alt={isFavoriteApp ? 'Remove from favorites' : 'Add to favorites'}
                                        size="sm"
                                    />
                                </HeaderInfo>
                                <HeaderAppDescription>{cut(description, 140)}</HeaderAppDescription>
                            </CollapsedContent>
                        </Fragment>
                    }
                    collapsed={!isAppProcessesOpen}
                    onToggle={this.toggleAppProcesses}>
                    { this.getProcesses(processesDefinitions, favoriteProcesses) }
                </Card>
            </Tooltip>
        );
    }
}

export default MyAppsCard;

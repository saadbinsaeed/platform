/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CollapsedContent from 'app/components/atoms/CollapsedContent/CollapsedContent';
import Icon from 'app/components/atoms/Icon/Icon';
import MyAppCard from 'app/components/ABox/MyApps/MyAppCard';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

const MyAppListStyled = styled.div`
    padding: 0.5rem 0.8rem;
`;
const TitleWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    .collapsed-cards {
        margin-left: auto;
        font-size: .8rem;
        color: rgba(255,255,255,0.4);
    }
    .collapsed-content, .collapsed-cards {
        cursor: pointer;
    }
`;
const CollapseIcon = styled(Icon)`
    opacity: 0.6;
`;
const EmptySectionMsg = styled.div`
    font-size: 13px;
    margin-left: 8px;
`;
const MasonryGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px,1fr));
  grid-auto-rows: 60px;
`;


/**
 * Renders the view to display the classification.
 */
class MyAppsSection extends PureComponent<Object, Object> {

    static propTypes = {
        appsList: PropTypes.array.isRequired,
        title: PropTypes.string.isRequired,
        addToFavorites: PropTypes.func.isRequired,
        favoriteAppsPath: PropTypes.string.isRequired,
        favoriteProcessesPath: PropTypes.string.isRequired,
        favorites: PropTypes.object.isRequired,
        errorMessage: PropTypes.string,
        collapsed: PropTypes.bool,
    }

    static defaultProps = {
        collapsed: false,
    }
    collapsing = false;

    constructor(props: Object) {
        super(props);
        this.state = {
            showContent: true,
            allCollapsed: props.collapsed,
        };
    }

    @bind
    toggleContent(e: Object) {
        e.stopPropagation();
        if(this.props.appsList.length < 1) {
            return;
        }
        this.setState({
            showContent: !this.state.showContent,
        });
    }

    @bind
    toggleCollapsing(e: Object) {
        e.stopPropagation();
        if (this.collapsing) {
            return;
        }
        this.collapsing = true;
        this.setState({ collapsing: true },
            () => setTimeout(() => {
                this.setState({ allCollapsed: !this.state.allCollapsed, collapsing: false }, () => this.collapsing = false);
            }, 10)
        );
    }

    @bind
    @memoize()
    getCards({
        appsList,
        allCollapsed,
        favoriteApps,
        addToFavorites,
        favoriteAppsPath,
        favoriteProcesses,
        favoriteProcessesPath,
    }: Object) {
        return appsList.filter(({ processesDefinitions }) => processesDefinitions && processesDefinitions.length)
            .sort((a,b) => a.name < b.name ? -1 : 1)
            .map((app, appIndex) => (
                <MyAppCard
                    app={app}
                    key={appIndex}
                    appIndex={appIndex}
                    collapsed={allCollapsed}
                    favoriteApps={favoriteApps}
                    addToFavorites={addToFavorites}
                    favoriteAppsPath={favoriteAppsPath}
                    favoriteProcesses={favoriteProcesses}
                    favoriteProcessesPath={favoriteProcessesPath}
                    className="item"
                />
            ));
    };

    /**
     * @override
     */
    render(): Object {
        const {
            appsList,
            title,
            favorites,
            favoriteAppsPath,
            favoriteProcessesPath,
            addToFavorites,
            errorMessage,
        } = this.props;
        const { showContent, allCollapsed, collapsing} = this.state;
        const { toggleContent, toggleCollapsing } = this;
        const favoriteApps = new Set(favorites.favoriteApps);
        const favoriteProcesses = new Set(favorites.favoriteProcesses);
        const isEmptyList = appsList.length < 1;
        return (
            <MyAppListStyled>
                <TitleWrapper>
                    <h2 className="collapsed-content" onClick={toggleContent} >{title} <Icon name={showContent ? 'menu-up' : 'menu-down'}  /></h2>
                    <div className="collapsed-cards"  onClick={collapsing ? null : toggleCollapsing} >
                        {!isEmptyList && (
                            <div>
                                {
                                    collapsing ? '...' : (allCollapsed ? 'Expand' : 'Collapse')
                                }
                                <CollapseIcon size="sm" name={allCollapsed ? 'arrow-expand-vertical' : 'arrow-collapse-vertical'}/>
                            </div>
                        )}
                    </div>
                </TitleWrapper>

                <CollapsedContent opened={showContent}>
                    <MasonryGrid className="grid">
                        {
                            !isEmptyList ? this.getCards({
                                appsList,
                                allCollapsed,
                                favoriteApps,
                                addToFavorites,
                                favoriteAppsPath,
                                favoriteProcesses,
                                favoriteProcessesPath,
                            }) : (<EmptySectionMsg>{ errorMessage || `No ${title}.` }</EmptySectionMsg>)
                        }
                    </MasonryGrid>
                </CollapsedContent>
            </MyAppListStyled>
        );
    }
}

export default MyAppsSection;

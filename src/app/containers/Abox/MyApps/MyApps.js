/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import PageTemplate from 'app/components/templates/PageTemplate';
import Loader from 'app/components/atoms/Loader/Loader';
import InputText from 'app/components/atoms/Input/InputText';
import MyAppsSection from 'app/components/ABox/MyApps/MyAppsSection';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { shallowEquals } from 'app/utils/utils';
import { loadAboxMyApps, loadAboxMyAppsFavorites, saveAboxMyAppsFavorites } from 'store/actions/abox/myAppsActions';
import { bind, memoize, debounce } from 'app/utils/decorators/decoratorUtils';

const SearchLineStyled = styled.div`
    padding: 10px;
    margin: 0 auto;
    width: 85%;
    @media(max-width: ${({theme}) => theme.media.sm}) {
        width: 100%;
    }
`;

export const FAVORITE_APPS = 'favoriteApps';
export const FAVORITE_PROCESSES = 'favoriteProcesses';

/**
 * Renders the view to display the classification.
 */
class MyApps extends PureComponent<Object, Object> {

    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        records: PropTypes.array.isRequired,
        favorites: PropTypes.object.isRequired,
        loadAboxMyApps: PropTypes.func.isRequired,
        loadAboxMyAppsFavorites: PropTypes.func.isRequired,
        saveAboxMyAppsFavorites: PropTypes.func.isRequired,
    }

    state: Object
    map: Object = {}

    /**
     * @override
     */
    constructor(props) {
        super(props);
        this.state = {
            appList: Immutable(props.records),
        };
        this.props.loadAboxMyApps();
        this.props.loadAboxMyAppsFavorites();
    }

    componentDidUpdate(prevProps, prevState) {
        const { records } = this.props;
        if(prevProps.records !== records) {
            this.setState({
                appList: Immutable(records),
            });
        }
    }

    @bind
    @debounce()
    onSearch({ value }: Object) {
        let result = this.props.records;
        const searchValue = value.toLowerCase();
        if(searchValue) {
            result = this.props.records.reduce((appList, app, index) => {
                const { name, description, processesDefinitions } = app;
                const mathcedProcessesDefinitions = processesDefinitions.reduce((list, process, index) => {
                    const { description, deployedModel: { name } } = process;
                    if((name && name.toLowerCase().includes(searchValue)) || (description && description.toLowerCase().includes(searchValue))) {
                        list.push(process);
                    }
                    return list;
                }, []);
                if((name && name.toLowerCase().includes(searchValue)) || (description && description.toLowerCase().includes(searchValue))) {
                    appList.push(app);
                } else if (mathcedProcessesDefinitions.length > 0) {
                    appList.push({
                        ...app,
                        processesDefinitions: mathcedProcessesDefinitions,
                    });
                }
                return appList;
            }, []);

        }
        this.setState({
            appList: Immutable(result),
        });
    }

    @bind
    @memoize(shallowEquals)
    getMyAppSection({ title, appsList, favorites, collapsed, errorMessage }: Object) {
        return (
            <MyAppsSection
                favoriteAppsPath={FAVORITE_APPS}
                favoriteProcessesPath={FAVORITE_PROCESSES}
                addToFavorites={this.props.saveAboxMyAppsFavorites}
                title={title}
                favorites={favorites}
                appsList={appsList}
                collapsed={collapsed}
                errorMessage={errorMessage}
            />
        );
    };

    @bind
    _buildMap(appList: Array<Object>, isProcessesMap: boolean = false) {
        this.map = {};
        appList.forEach((app) => {
            if (isProcessesMap) {
                app.processesDefinitions.forEach((process) => {
                    this.map[process.key] = {
                        process,
                        app,
                    };
                });
            } else {
                this.map[app.id] = app;
            }
        });
    };

    @bind
    @memoize()
    _compileFavoriteLists(appList: Array<Object>, favorites: Object) {
        this._buildMap(appList);
        const favoriteAppList = (get(favorites, FAVORITE_APPS) || []).reduce((list, id) => {
            if(id && this.map[id]) {
                list.push(this.map[id]);
            }
            return list;
        }, []);
        this._buildMap(appList, true);
        const appTmpList = {};
        const favoriteProcessesList = (get(favorites, FAVORITE_PROCESSES) || []).reduce((list, key) => {
            const data = this.map[key];
            if(key && data) {
                const compiledApp = { ...data.app };
                if(appTmpList[compiledApp.id]) {
                    compiledApp.processesDefinitions = [
                        ...appTmpList[compiledApp.id].processesDefinitions,
                        data.process,
                    ];
                    list.splice(appTmpList[compiledApp.id].index, 1, compiledApp);
                    appTmpList[compiledApp.id] = {
                        index: appTmpList[compiledApp.id].index,
                        processesDefinitions: compiledApp.processesDefinitions
                    };
                } else {
                    compiledApp.processesDefinitions = [
                        data.process,
                    ];
                    list.push(compiledApp);
                    appTmpList[compiledApp.id] = {
                        index: list.length - 1,
                        processesDefinitions: compiledApp.processesDefinitions
                    };
                }
            }
            return list;
        }, []);
        return {
            favoriteAppList,
            favoriteProcessesList,
        };
    }

    /**
     * @override
     */
    render(): Object {
        const { isLoading, favorites } = this.props;
        const { appList } = this.state;
        const { onSearch, _compileFavoriteLists } = this;
        const { favoriteAppList, favoriteProcessesList } = _compileFavoriteLists(appList, favorites);
        return (
            <Fragment>
                { isLoading && <Loader absolute backdrop />}
                <PageTemplate title="My Apps" icon="classification-tags" iconType="af">
                    <ContentArea>
                        <SearchLineStyled>
                            <InputText type="search" onChange={onSearch} placeholder="Global Search" size="50" />
                        </SearchLineStyled>

                        {this.getMyAppSection({
                            title: 'Favorite Apps',
                            appsList: favoriteAppList,
                            favorites: favorites,
                            collapsed: false,
                        })}
                        {this.getMyAppSection({
                            title: 'Favorite Processes',
                            appsList: favoriteProcessesList,
                            favorites: favorites,
                            collapsed: false,
                        })}
                        {this.getMyAppSection({
                            title: 'All Apps',
                            appsList: appList,
                            favorites: favorites,
                            collapsed: true,
                            errorMessage: 'No Apps to display.',
                        })}
                    </ContentArea>
                </PageTemplate>
            </Fragment>

        );
    }
}

export default connect((state: Object) => ({
    isLoading: state.abox.app.list.isLoading,
    records: state.abox.app.list.records,
    favorites: state.abox.app.list.favorites,
}), { loadAboxMyApps, loadAboxMyAppsFavorites, saveAboxMyAppsFavorites })(MyApps);

/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import IFrame from 'app/components/atoms/IFrame/IFrame';
import { get } from 'app/utils/lo/lo';
import { bind, debounce } from 'app/utils/decorators/decoratorUtils';
import history from 'store/History';
import { setHeader } from 'store/actions/app/appActions';
import PageNotAllowed from '../ErrorPages/PageNotAllowed';


const LegacyAppContainer = styled.div`
    display: ${({ visible }) => visible ? 'block' : 'none'};

    ${({ isFormDetailView }) => isFormDetailView && `
        position: absolute;
        top: 205px;
        left: 0;
        right: 0;
        bottom: 0;
    `}
    ${({ isStartProcessView }) => isStartProcessView && `
        position: absolute;
        top: 55px;
        left: 0;
        right: 0;
        bottom: 0;
    `}
`;

/**
 * Loads the Legacy Platform in an iframe.
 */
class LegacyApp extends Component<Object, Object> {

    static propTypes = {
        route: PropTypes.string.isRequired,
        userProfile: PropTypes.object,
        routeHistory: PropTypes.arrayOf(PropTypes.object),
        setHeader: PropTypes.func.isRequired,
        legacyKey: PropTypes.number,
    };

    state = { key: this.props.legacyKey };
    empty = { title: '', src: '/legacy/#/empty' };

    /**
     * @override
     */
    componentDidMount() {
        window.addEventListener('message', this.processMessage, false);
    }

    @bind
    @debounce(1000) // WORKAROUND: issue#7947: the first time we go to maps we receive #/abox/empty first and then #/maps/situational_awareness/
    processMessage({ data }) {
        if (data && data.key === 'legacy-hash' && data.hash) {
            const goTo = this.translateLegacyHash(data.hash);
            const isRedirectToTask = data.hash.startsWith('#/abox/activities') && window.location.hash.startsWith('#/abox/task/');
            if (data.newURL.includes('/#/abox/reload-full-page') || isRedirectToTask) {
                this.props.onReloadFullPage && this.props.onReloadFullPage();
            } else if (data.newURL.includes('/#/abox/processes-new')) {
                history.push('/abox/processes-new');
            } else if (goTo) {
                if(goTo.includes('abox/processes/new') || goTo.includes('abox/process/new')) {
                    return;
                }
                if (goTo !== get(this.props.routeHistory, '[0].pathname')) {
                    history.push(goTo);
                }
            } else if (window.location.hash === '#/legacy/maps' && !data.hash.startsWith('#/maps/')) {
                // if we are in the maps route but we are not loading maps means that a "browser back" have been executed
                this.props.history.goBack();
            } else if (window.location.hash.endsWith('/form')) {
                // if we are in the form route but we are not loading the form means that a "browser back" have been executed
                if ((this.isLegacyTaskForm(this.props) && !data.hash.startsWith('#/task-form/'))
                  || (!this.isLegacyTaskForm(this.props) && !data.hash.endsWith('/empty'))) {
                    this.props.history.goBack();
                }
            } else if (window.location.hash.startsWith('#/abox/process-start')) {
                // if we are in the starting process route but we are not loading the start form means that a "browser back" have been executed
                if ((this.isLegacyStartForm(this.props) && !data.hash.startsWith('#/abox/processes/new'))
                  || (!this.isLegacyStartForm(this.props) && !data.hash.endsWith('/empty'))) {
                    this.props.history.goBack();
                }
            }
        }
    };


    /**
     *
     */
    componentWillReceiveProps(nextProps: Object) {
        const { route, location } = nextProps;
        if (route !== this.props.route && route.startsWith('/legacy') && !route.startsWith('/legacy/task')) {
            const { title } = this.getTitleAndSrc(nextProps);
            this.props.setHeader({ title, subTitle: '', headerInfo: [] });
        }
        const isOnTaskForm = location.pathname.match(/abox\/task\/(\d+)\/form$/);
        if (isOnTaskForm) {
            this.setState({ key: nextProps.legacyKey });
        }
    }

    getRoute(props): string {
        return props.route || (props.location && props.location.pathname) || '';
    }

    isLegacyStartForm(props) {
        const { processDefinition } = props;
        const startForm = get(processDefinition, '_startFormDefinition');
        return startForm && startForm.id && !startForm.definition.version;
    }

    isLegacyTaskForm(props) {
        const { task } = props;
        const form = get(task, 'form');
        return form && form.id && !form.definition.version;
    }

    /**
     * Build this application's route using the legacy's route (ifreme).
     *
     * @param legacyHash the legacy application's route.
     * @return this application's route.
     */
    translateLegacyHash(legacyHash) {
        switch (legacyHash) {
            case '#/maps/situational_awareness': return '/legacy/maps';
            case '#/maps/situational_awareness/': return '/legacy/maps';
            case '#/analytics/default/': return '/legacy/charts';
            case '#/abox/processes/new': return '/abox/processes-new';
            case '#/abox/dashboard' : return '/dashboards';
            case '#/abox/activities/': case '#/abox/processes':
                return '/abox/processes';
            default: {
                if (legacyHash.startsWith('#/platform/')) {
                    const matchUrl = legacyHash.replace('#/platform/', '');
                    return `/${matchUrl}`;
                } else if (legacyHash.startsWith('#/abox/activities/')) {
                    const processId = legacyHash.match(/#\/abox\/activities\/(\d+)/);
                    return `/abox/process/${String(processId && processId[1])}/tasks`;
                } else if (legacyHash.startsWith('#/abox/tasks/')) {
                    const taskId = legacyHash.match(/#\/abox\/tasks\/(\d+)/);
                    return `/abox/task/${String(taskId && taskId[1])}/form`;
                }  else if (legacyHash.startsWith('#/abox/processes/') && !legacyHash.startsWith('#/abox/processes/new')) {
                    // $FlowFixMe
                    const processId = legacyHash.match(/abox\/processes\/(.+)$/);
                    return `/abox/process-started/${processId[1]}`;
                } else if (legacyHash.startsWith('#/abox/task-form/')) {
                    const taskId = legacyHash.match(/#\/abox\/task-form\/(\d+)/);
                    return `/abox/task/${String(taskId && taskId[1])}/form`;
                }
                return null;
            }
        }
    }

    /**
     * Build the title and the iframe's route using the route of this application.
     */
    getTitleAndSrc(props): Object {
        const route = this.getRoute(props);
        switch (route) {
            case '/legacy/abox/tasks-card-list':
            case '/legacy/tasks':
                history.push('/abox/tasks');
                return this.empty;
            case '/legacy/empty': return this.empty;
            case '/legacy/maps': return { title: 'Situational Awareness', src: '/legacy/#/maps/situational_awareness/' };
            case '/legacy/charts': return { title: 'Charts', src: '/legacy/#/analytics/default/' };
            case '/legacy/dashboard': return { title: 'Dashboards', src: '/legacy/#/abox/dashboard' };
            case '/legacy/abox/activities': return { title: 'Card View', src: '/legacy/#/abox/activities/' };
            case '/legacy/abox': return { title: 'A-Box', src: '/legacy/#/abox/processes' };
            default: {
                if (route.startsWith('/legacy/process/')) {
                    const processId = route.match(/\/legacy\/process\/(\d+)/);
                    history.push(`/abox/process/${String(processId && processId[1])}`);
                    return this.empty;
                } else if (route.startsWith('/abox/activities')) {
                    const processId = route.match(/\/abox\/activities\/(\d+)/);
                    history.push(`/abox/process/${String(processId && processId[1])}`);
                    return this.empty;
                } else if (route.match(/\/abox\/processes\/(\d+)/)) {
                    const processId = route.match(/\/abox\/processes\/(\d+)/);
                    history.push(`/abox/process/${String(processId && processId[1])}`);
                    return this.empty;
                } else if (route.startsWith('/legacy/task/')) {
                    const match = route.match(/\/legacy\/task\/(\d+)/);
                    const taskId = String(match && match[1]);
                    history.push(`/abox/task/${taskId}`);
                    return { title: '', src: `/legacy/#/task-form/${taskId}` };
                } else if (route.match(/abox\/task\/(\d+)\/form$/)) {
                    // $FlowFixMe
                    const taskId = route.match(/abox\/task\/(\d+)\/form$/)[1];
                    if (taskId && this.isLegacyTaskForm(props)) {
                        return { title: '', src: `/legacy/#/task-form/${taskId}` };
                    } else {
                        return this.empty;
                    }
                } else if (route.match(/abox\/process-start\/(.+)\/(.+)\/(.+)$/)) {
                    return this.empty;
                } else if (route.match(/abox\/process-start\/(\d+)\/(.+)$/)) {
                    const matchUrl = route.match(/abox\/process-start\/(\d+)\/(.+)$/);
                    const processDefinitionKey = matchUrl && matchUrl[2];
                    if (processDefinitionKey && this.isLegacyStartForm(props)) {
                        return { title: '', src: `/legacy/#/abox/processes/new/${String(processDefinitionKey)}` };
                    } else {
                        return this.empty;
                    }
                } else if (!route.startsWith('/legacy/')) {
                    return this.empty;
                }
                console.error('route', this.props.route, ' not mapped, returning the legacy abox empty page.'); // eslint-disable-line no-console
                return this.empty;
            }
        }
    }

    /**
     * @override
     */
    render() {
        const { src } = this.getTitleAndSrc(this.props);
        const route = this.getRoute(this.props);
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canViewMaps = isAdmin || permissionsSet.has('maps.sa.view');
        if (route === '/legacy/maps' && !canViewMaps) {
            return <PageNotAllowed title="Maps" />;
        }
        const showTaskForm = route.match(/abox\/task\/(\d+)\/form$/) && this.isLegacyTaskForm(this.props);
        const showStartForm = route.startsWith('/abox/process-start/') && this.isLegacyStartForm(this.props);
        const visible = route.startsWith('/legacy') || showTaskForm || showStartForm;
        return (
            <LegacyAppContainer
                visible={visible}
                isFormDetailView={showTaskForm}
                isStartProcessView={showStartForm}
                key={this.state.key}
            >
                <IFrame src={src} />
            </LegacyAppContainer>
        );
    }
}


export default connect(
    (state: Object): Object => ({
        route: state.routing.location.pathname,
        userProfile: state.user.profile,
        routeHistory: state.history.list,
        processDefinition: get(state.abox.processDefinition, 'data[0]'),
        task: state.abox.task.details.data,
        legacyKey: state.legacy.legacyAppFormUpdate,
    }),
    { setHeader }
)(withRouter(LegacyApp));

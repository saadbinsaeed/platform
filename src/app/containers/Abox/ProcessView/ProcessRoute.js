/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withTheme } from 'styled-components';

import PageTemplate from 'app/components/templates/PageTemplate';
import TabRow from 'app/components/molecules/Tabs/TabRow';
import TabItem from 'app/components/molecules/Tabs/TabItem';
import Loader from 'app/components/atoms/Loader/Loader';
import ProcessSummaryTab from 'app/containers/Abox/ProcessView/ProcessSummaryTab';
import ProcessAboutTab from 'app/containers/Abox/ProcessView/ProcessAboutTab';
import ProcessTimelineTab from 'app/containers/Abox/ProcessView/ProcessTimelineTab';
import ProcessSubProcessesTab from 'app/containers/Abox/ProcessView/ProcessSubProcessesTab';
import AboxAttachments from 'app/components/ABox/Attachments/AboxAttachments';
import ProcessTasksTab from 'app/containers/Abox/ProcessView/ProcessTasksTab';
import AboxTeam from 'app/components/ABox/Team/AboxTeam';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import {
    loadProcessDetails,
    cancelProcess,
    loadSubprocesses,
} from 'store/actions/abox/processActions';

import { formatDate } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { stringify, getNum } from 'app/utils/utils';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import { loadMessenger } from 'store/actions/messenger/messengerActions';
import { getPriorityColor } from 'app/config/aboxConfig';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import RelationshipsTab from 'app/containers/Entities/Relationships/RelationshipsTab';
import AddRelationship from 'app/containers/Entities/Relationships/AddRelationship';
import { ABOX_PROCESS_RELATIONSHIPS_DATA_TABLE } from 'app/config/dataTableIds';

/**
 *
 */
class ProcessRoute extends PureComponent<Object, Object> {
    static propTypes = {
        details: PropTypes.object,
        isLoading: PropTypes.bool,
        loadProcessDetails: PropTypes.func,
        cancelProcess: PropTypes.func,
        uploadProcessAttachment: PropTypes.func,
        loadMessenger: PropTypes.func,
        loadSubprocesses: PropTypes.func,
    };

    static defaultProps = {
        details: {},
        isLoading: false,
    };

    id: string;

    /**
     * constructor - description
     */
    constructor(props: Object) {
        super(props);
        this.id = stringify(get(props, 'match.params.id')) || '';
        this.props.loadProcessDetails(this.id);
        this.props.loadSubprocesses(this.id);
    }

    /**
     * @override
     */
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.id = stringify(this.props.match.params.id) || '';
            this.props.loadProcessDetails(this.id);
            this.props.loadSubprocesses(this.id);
        } else if (!prevProps.outdated && this.props.outdated) {
            this.props.loadProcessDetails(this.id);
        }
    }

    @bind
    @memoize()
    buildInfo(details: Object) {
        if (!details) {
            return null;
        }
        const { createdBy, createDate, endDate, status } = details;
        const createdByName = (createdBy && createdBy.name) || '';
        const created = (createDate && formatDate(createDate)) || '';
        const modified = (status && status.lastUpdate && formatDate(status.lastUpdate)) || '';
        return [
            { key: 'Created by', value: createdByName },
            { key: 'Created Date', value: created },
            { key: 'Last Modified Date', value: modified },
            { key: 'Status', value: !endDate ? 'Open' : 'Closed' },
        ];
    };

    handleCancelAboxProcessActivity = () =>
        this.props.cancelProcess(this.id)
            .then(() => this.props.loadProcessDetails(this.id),
            );

    buildAboxAttachments = props => <AboxAttachments {...props} type="process"/>;

    buildAboxTeam = props => <AboxTeam
        {...props}
        reloadDetails={this.props.loadProcessDetails}
        details={this.props.details}
        type="process"
    />;

    @bind
    @memoize()
    buildMenuItems(details) {
        return (
            <MenuItem
                name="Cancel process"
                icon="cancel"
                onClick={this.handleCancelAboxProcessActivity}
            />)
        ;
    };

    @bind
    @memoize()
    getBackStyles(headerBackgroundColor) {
        return (
            { background: headerBackgroundColor }
        );
    };
    loadMessenger = () => this.props.loadMessenger(this.id, 'process');

    /**
     * @override
     */
    render(): Object {
        const { match, details, isLoading, theme } = this.props;

        if (!isLoading && !details) {
            return <PageNotAllowed title={`Process (${this.id})`}/>;
        }

        const { name, variables, endDate } = details || {};
        const infoArray = this.buildInfo(details);
        const menuItems = !endDate ? this.buildMenuItems(details) : null;
        const priority = getNum(details, 'variables.priority') || '';

        const priorityColor = endDate ? 'disabled' : getPriorityColor(priority);
        const headerBackgroundColor = `linear-gradient(45deg, ${theme.priorityGradients[priorityColor][0]}, ${theme.priorityGradients[priorityColor][1]})`;
        return (
            <Fragment>
                { isLoading && <Loader backdrop absolute />}
                { details && <PageTemplate
                    title={name || 'No Name'}
                    subTitle={`#${this.id}`}
                    pillText={`${(variables && Math.floor(Number(variables.progress))) || 0}%`}
                    info={infoArray}
                    actions={
                        <ButtonIcon
                            icon="messenger"
                            type="af"
                            title="Open messenger"
                            onClick={this.loadMessenger}
                        />
                    }
                    menuItems={menuItems}
                    color={this.getBackStyles(headerBackgroundColor)}
                    overflowHidden={ true }
                >
                    <TabRow color={headerBackgroundColor}>
                        <TabItem label="Summary" to={`/abox/process/${this.id}/summary`}/>
                        <TabItem label="About" to={`/abox/process/${this.id}/about`}/>
                        <TabItem label="Sub-Processes" to={`/abox/process/${this.id}/sub-processes`}/>
                        <TabItem label="Tasks" to={`/abox/process/${this.id}/tasks`}/>
                        <TabItem label="Team" to={`/abox/process/${this.id}/team`}/>
                        <TabItem label="Relationships" to={`/abox/process/${this.id}/relationships`}/>
                        <TabItem label="Attachments" to={`/abox/process/${this.id}/attachments`}/>
                        <TabItem label="History" to={`/abox/process/${this.id}/history`}/>
                    </TabRow>
                    <Switch>
                        <Route path={`${match.url}/`} exact component={() => <Redirect to={`${match.url}/summary`}/>}/>
                        <Route path={`/abox/process/:id/summary`} exact component={ProcessSummaryTab}/>
                        <Route path={`/abox/process/:id/about`} exact component={ProcessAboutTab}/>
                        <Route
                            path={`/abox/process/:id/sub-processes`}
                            exact
                            component={ProcessSubProcessesTab}
                        />
                        <Route path={`/abox/process/:id/tasks`} exact component={ProcessTasksTab}/>
                        <Route path={`/abox/process/:id/team`} exact component={this.buildAboxTeam}/>
                        <Route path={`/abox/process/:id/attachments`} exact component={this.buildAboxAttachments}/>
                        <Route
                            path={`/abox/process/:entityId/relationships/:type2/add`}
                            exact
                            render={({ match: { params }, location }) => (<AddRelationship
                                {...params}
                                location={location}
                                type1={'process'}
                            />)}
                        />
                        <Route
                            path={'/abox/process/:id/relationships'}
                            exact
                            component={() => <Redirect to={`/abox/process/${this.id}/relationships/thing`}/>}
                        />
                        <Route
                            path={'/abox/process/:entityId/relationships/:type2'}
                            render={({ match: { params } }) => (<RelationshipsTab
                                {...params}
                                dataTableId={ABOX_PROCESS_RELATIONSHIPS_DATA_TABLE}
                                baseUri={`/abox/process/${this.id}/relationships`}
                                type1={'process'}
                            />)}
                        />
                        <Route path={'/abox/process/:id/history'} render={() => <ProcessTimelineTab id={this.id} />} />
                    </Switch>
                </PageTemplate>}
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.abox.process.details.isLoading,
        details: state.abox.process.details.data,
        outdated: state.abox.process.detailsOutdated,
    }),
    {
        loadProcessDetails,
        loadMessenger,
        cancelProcess,
        loadSubprocesses,
    },
)(withTheme(ProcessRoute));

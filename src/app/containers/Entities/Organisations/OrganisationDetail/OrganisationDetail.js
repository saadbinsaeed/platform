/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import memoize from 'fast-memoize';

import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import ClassificationsTab from 'app/containers/Common/ClassificationsTab/ClassificationsTab';
import EntityAttachmentsView from 'app/containers/Entities/Attachments/EntityAttachmentsView';
import Loader from 'app/components/atoms/Loader/Loader';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import PageTemplate from 'app/components/templates/PageTemplate';
import TabItem from 'app/components/molecules/Tabs/TabItem';
import TabRow from 'app/components/molecules/Tabs/TabRow';
import EntityTimeline from 'app/containers/Entities/Timeline/EntityTimeline';
import { formatDate } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { loadOrganisation, SAVE_ORGANISATION } from 'store/actions/entities/organisationsActions';
import { openEntityChildrenDrawer } from 'store/actions/entityChildrenDrawer/entityChildrenDrawerActions';
import { ORGANISATION_ATTACHMENTS_DATA_TABLE, ORGANISATION_RELATIONSHIPS_DATA_TABLE } from 'app/config/dataTableIds';
import { UPLOAD_IMAGE } from 'store/actions/entities/entitiesActions';

import OrganisationAbout from './OrganisationAbout/OrganisationAbout';
import OrganisationChildren from './OrganisationChildren/OrganisationChildren';
import OrganisationsSummary from './OrganisationsSummary/OrganisationsSummary';
import RelationshipsTab from 'app/containers/Entities/Relationships/RelationshipsTab';

/**
 * Organisation container
 */
class OrganisationDetail extends PureComponent<Object, Object> {

    static propTypes: Object = {
        id: PropTypes.string.isRequired,
        organisation: PropTypes.object,
        loadOrganisation: PropTypes.func,
        isLoading: PropTypes.bool,
        lastActionError: PropTypes.bool,
        lastActionType: PropTypes.string,
        recentAttachments: PropTypes.arrayOf(PropTypes.object),
    };

    actionTypes = [SAVE_ORGANISATION, UPLOAD_IMAGE];

    constructor(props: Object) {
        super(props);
        props.loadOrganisation(props.id);
    };

    /**
     * @override
     * @param prevProps the properties that the component will receive.
     */
    componentDidUpdate(prevProps) {
        const { lastActionError, lastActionType, id } = this.props;
        if ((prevProps.id !== id && id !== 'add') || (!lastActionError && this.actionTypes.includes(lastActionType))) {
            this.props.loadOrganisation(id);
        }
    }

    buildInfo = memoize((createdBy: string, modified: string, status: string) => [
        { key: 'Created by', value: createdBy },
        { key: 'Last Modified', value: modified },
        { key: 'Status', value: status },
    ]);

    /**
     * @override
     */
    render() {
        const { id, organisation, isLoading, recentAttachments, loadOrganisation } = this.props;
        if (!isLoading && !organisation) {
            return <PageNotAllowed title={`Organisation (ID:${id})`}/>;
        }

        const { modifiedDate, active, createdDate } = organisation || {};
        const createdByName = String(get(organisation, 'createdBy.name') || '');
        const createdBy = `${createdByName ? `${createdByName} on ` : ''}${formatDate(createdDate)}`;
        const modified = formatDate(modifiedDate);
        const status = `${active ? 'Active' : 'Inactive'}`;
        const infoArray = this.buildInfo(createdBy, modified, status);

        return (
            <Fragment>
                {isLoading && <Loader absolute backdrop/>}
                {organisation && <PageTemplate
                    title={get(organisation, 'name')}
                    subTitle={id}
                    info={infoArray}
                    actions={
                        <ButtonIcon
                            icon="sitemap"
                            title="Open Children"
                            onClick={this.props.openChildrenDrawer}
                        />
                    }
                    overflowHidden
                >
                    <TabRow>
                        <TabItem label="Summary" to={`/organisations/${id}/summary`}/>
                        <TabItem label="About" to={`/organisations/${id}/about`}/>
                        <TabItem label="Classifications" to={`/organisations/${id}/classifications`}/>
                        <TabItem label="Children" to={`/organisations/${id}/children`}/>
                        <TabItem label="Relationships" to={`/organisations/${id}/relationships`}/>
                        <TabItem label="Attachments" to={`/organisations/${id}/attachments`}/>
                        <TabItem label="History" to={`/organisations/${id}/history`}/>
                    </TabRow>
                    <Switch>
                        <Route
                            path={`/organisations/:id`}
                            exact
                            component={() => <Redirect to={`/organisations/${id}/summary`}/>}
                        />
                        <Route path={'/organisations/:id/summary'}>
                            <OrganisationsSummary
                                organisation={organisation}
                                recentAttachments={recentAttachments}
                                loadOrganisation={loadOrganisation}
                            />
                        </Route>
                        <Route path={'/organisations/:id/about'}>
                            <OrganisationAbout organisation={organisation} location={this.props.location}/>
                        </Route>
                        <Route path={'/organisations/:id/classifications'}>
                            <ClassificationsTab type="organisation"/>
                        </Route>
                        <Route path={'/organisations/:id/children'} exact component={OrganisationChildren}/>
                        <Route
                            path={'/organisations/:id/relationships'}
                            exact
                            component={() => <Redirect to={`/organisations/${id}/relationships/thing`}/>}
                        />
                        <Route
                            path={'/organisations/:entityId/relationships/:type2'}
                            render={({ match: { params } }) => (<RelationshipsTab
                                {...params}
                                dataTableId={ORGANISATION_RELATIONSHIPS_DATA_TABLE}
                                baseUri={`/organisations/${id}/relationships`}
                                type1={'organisation'}
                            />)}
                        />
                        <Route path={'/organisations/:id/attachments'}>
                            <EntityAttachmentsView
                                entityId={id}
                                entityType="organisation"
                                dataGridId={ORGANISATION_ATTACHMENTS_DATA_TABLE}
                            />
                        </Route>
                        <Route path={'/organisations/:id/history'}>
                            <EntityTimeline entityType="organisation" entityId={id}/>
                        </Route>
                    </Switch>
                </PageTemplate>}
            </Fragment>
        );
    }
}

const mapStateToProps: Function = (state: Object, ownProps: Object) => ({
    id: ownProps.match.params.id,
    userProfile: state.user.profile,
    isLoading: state.entities.organisations.details.isLoading,
    organisation: get(state.entities.organisations.details.data, 'organisation'),
    lastActionType: state.global.lastActionType,
    lastActionError: state.global.lastActionError,
    recentAttachments: get(state.entities.organisations.details.data, 'recentAttachments'),
});

export default connect(
    mapStateToProps,
    { loadOrganisation, openChildrenDrawer: openEntityChildrenDrawer },
)(withRouter(OrganisationDetail));

/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import memoize from 'fast-memoize';

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
import { loadPerson, UPDATE_PERSON } from 'store/actions/entities/peopleActions';
import { PERSON_ATTACHMENTS_DATA_TABLE, PERSON_RELATIONSHIPS_DATA_TABLE } from 'app/config/dataTableIds';
import { UPLOAD_IMAGE } from 'store/actions/entities/entitiesActions';

import PeopleSummary from './PeopleSummary/PeopleSummary';
import PersonAbout from './PersonAbout/PersonAbout';
import RelationshipsTab from 'app/containers/Entities/Relationships/RelationshipsTab';

/**
 * Person container
 */
class PeopleDetail extends PureComponent<Object, Object> {

    static propTypes: Object = {
        id: PropTypes.string.isRequired,
        loadPerson: PropTypes.func.isRequired,
        person: PropTypes.object,
        isLoading: PropTypes.bool,
        lastActionError: PropTypes.bool,
        lastActionType: PropTypes.string,
        recentAttachments: PropTypes.arrayOf(PropTypes.object),
    };

    actionTypes = [UPDATE_PERSON, UPLOAD_IMAGE];

    constructor(props: Object) {
        super(props);
        props.loadPerson(props.id);
    };

    /**
     * @override
     * @param prevProps the properties that the component will receive.
     */
    componentDidUpdate(prevProps: Object) {
        const { lastActionError, lastActionType, id } = this.props;
        if ((prevProps.id !== id && id !== 'add') || (!lastActionError && this.actionTypes.includes(lastActionType))) {
            this.props.loadPerson(id);
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
        const { id, isLoading, person, recentAttachments, loadPerson } = this.props;
        if (!isLoading && !person) {
            return <PageNotAllowed title={`People (ID:${id})`}/>;
        }

        const { active, createdBy, createdDate, modifiedDate } = person || {};
        const createdByCompile = `${createdBy
            ? `${String(get(createdBy, 'name'))} on `
            : ''} ${formatDate(createdDate)}`;
        const modified = `${String(get(person, 'modifiedBy.name') || '')} on ${formatDate(modifiedDate)}`;
        const status = active ? 'Active' : 'Inactive';
        const infoArray = this.buildInfo(createdByCompile, modified, status);
        return (
            <Fragment>
                {isLoading && <Loader absolute backdrop/>}
                {person && <PageTemplate title={get(person, 'name')} subTitle={` #${id} `} info={infoArray} overflowHidden >
                    <TabRow>
                        <TabItem label="Summary" to={`/people/${id}/summary`}/>
                        <TabItem label="About" to={`/people/${id}/about`}/>
                        <TabItem label="Classifications" to={`/people/${id}/classifications`}/>
                        <TabItem label="Relationships" to={`/people/${id}/relationships`}/>
                        <TabItem label="Attachments" to={`/people/${id}/attachments`}/>
                        <TabItem label="History" to={`/people/${id}/history`}/>
                    </TabRow>
                    <Switch>
                        <Route path={`/people/:id`} exact component={() => <Redirect to={`/people/${id}/summary`}/>}/>
                        <Route path={'/people/:id/summary'}>
                            <PeopleSummary
                                person={person}
                                recentAttachments={recentAttachments}
                                loadPerson={loadPerson}
                            />
                        </Route>
                        <Route path={'/people/:id/about'}>
                            <PersonAbout person={person} location={this.props.location}/>
                        </Route>
                        <Route path={'/people/:id/classifications'}>
                            <ClassificationsTab type="person"/>
                        </Route>
                        <Route
                            path={'/people/:id/relationships'}
                            exact
                            component={() => <Redirect to={`/people/${id}/relationships/thing`}/>}
                        />
                        <Route
                            path={'/people/:entityId/relationships/:type2'}
                            render={({ match: { params } }) => (<RelationshipsTab
                                {...params}
                                dataTableId={PERSON_RELATIONSHIPS_DATA_TABLE}
                                baseUri={`/people/${id}/relationships`}
                                type1={'person'}
                            />)}
                        />
                        <Route path={'/people/:id/attachments'}>
                            <EntityAttachmentsView
                                entityId={this.props.id}
                                entityType="person"
                                dataGridId={PERSON_ATTACHMENTS_DATA_TABLE}
                            />
                        </Route>
                        <Route path={'/people/:id/history'}>
                            <EntityTimeline entityType="person" entityId={this.props.id}/>
                        </Route>
                    </Switch>

                </PageTemplate>}
            </Fragment>
        );
    }
}

const mapStateToProps = (state: Object, ownProps: Object) => ({
    id: ownProps.match.params.id,
    userProfile: state.user.profile,
    isLoading: state.entities.people.details.isLoading,
    person: get(state.entities.people.details.data, 'person'),
    lastActionType: state.global.lastActionType,
    lastActionError: state.global.lastActionError,
    recentAttachments: get(state.entities.people.details.data, 'recentAttachments'),
});

export default connect(
    mapStateToProps,
    { loadPerson },
)(withRouter(PeopleDetail));

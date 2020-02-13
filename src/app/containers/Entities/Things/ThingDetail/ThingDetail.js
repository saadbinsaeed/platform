/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import memoize from 'fast-memoize';

import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import ClassificationsTab from 'app/containers/Common/ClassificationsTab/ClassificationsTab';
import EntityAttachmentsView from 'app/containers/Entities/Attachments/EntityAttachmentsView';
import Loader from 'app/components/atoms/Loader/Loader';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import PageTemplate from 'app/components/templates/PageTemplate';
import TabItem from 'app/components/molecules/Tabs/TabItem';
import TabRow from 'app/components/molecules/Tabs/TabRow';
import Timeline from 'app/containers/Entities/Timeline/EntityTimeline';
import { formatDate } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { loadThing, THING_SAVE } from 'store/actions/entities/thingsActions';
import { openEntityChildrenDrawer } from 'store/actions/entityChildrenDrawer/entityChildrenDrawerActions';
import { stringify } from 'app/utils/utils';
import { THING_ATTACHMENTS_DATA_TABLE, THING_RELATIONSHIPS_DATA_TABLE } from 'app/config/dataTableIds';
import { UPLOAD_IMAGE } from 'store/actions/entities/entitiesActions';

import ThingAbout from './ThingAbout/ThingAbout';
import ThingChildren from './ThingChildren/ThingChildren';
import ThingSummary from './ThingSummary/ThingSummary';
import RelationshipsTab from 'app/containers/Entities/Relationships/RelationshipsTab';

/**
 * @class
 * Main container to display the detail of a Thing
 *
 * @example <ThingView />
 */
class ThingDetail extends PureComponent<Object, Object> {

    static propTypes = {
        id: PropTypes.string.isRequired,
        loadThing: PropTypes.func.isRequired,
        thing: PropTypes.object,
        isLoading: PropTypes.bool,
        lastActionError: PropTypes.bool,
        lastActionType: PropTypes.string,
        openChildrenDrawer: PropTypes.func,
        userProfile: PropTypes.object,
    };

    actionTypes: Array<string> = [THING_SAVE, UPLOAD_IMAGE];

    constructor(props: Object) {
        super(props);
        props.loadThing(props.id);
    };

    /**
     * @override
     * @param prevProps the properties that the component will receive.
     */
    componentDidUpdate(prevProps) {
        const { lastActionError, lastActionType, id } = this.props;
        if ((prevProps.id !== id && id !== 'add') || (!lastActionError && this.actionTypes.includes(lastActionType))) {
            this.props.loadThing(id);
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
        const { id, isLoading, thing } = this.props;

        if (!isLoading && !thing) {
            return <PageNotAllowed title={`Thing (ID:${id})`}/>;
        }

        const createdBy = `${stringify(get(thing, 'createdBy.name')) || ''} on ${formatDate(get(
            thing,
            'createdDate',
        ))}`;
        const modified = formatDate(get(thing, 'modifiedDate'));
        const status = get(thing, 'active') ? 'Active' : 'Inactive';
        const infoArray = this.buildInfo(createdBy, modified, status);
        return (
            <Fragment>
                {isLoading && <Loader absolute backdrop/>}
                {thing && <PageTemplate
                    title={thing.name}
                    subTitle={`#${thing.id}`}
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
                        <TabItem label="Summary" to={`/things/${id}/summary`}/>
                        <TabItem label="About" to={`/things/${id}/about`}/>
                        <TabItem label="Classifications" to={`/things/${id}/classifications`}/>
                        <TabItem label="Children" to={`/things/${id}/children`}/>
                        <TabItem label="Relationships" to={`/things/${id}/relationships`}/>
                        <TabItem label="Attachments" to={`/things/${id}/attachments`}/>
                        <TabItem label="History" to={`/things/${id}/history`}/>
                    </TabRow>
                    <Switch>
                        <Route path={`/things/:id`} exact component={() => <Redirect to={`/things/${id}/summary`}/>}/>
                        <Route path={'/things/:id/summary'} component={ThingSummary}/>
                        <Route path={'/things/:id/about'} component={ThingAbout}/>
                        <Route path={'/things/:id/classifications'}>
                            <ClassificationsTab type="thing"/>
                        </Route>
                        <Route path={'/things/:id/children'} component={ThingChildren}/>
                        <Route
                            path={'/things/:id/relationships'}
                            exact
                            component={() => <Redirect to={`/things/${id}/relationships/thing`}/>}
                        />
                        <Route
                            path={'/things/:entityId/relationships/:type2'}
                            render={({ match: { params } }) => (<RelationshipsTab
                                {...params}
                                dataTableId={THING_RELATIONSHIPS_DATA_TABLE}
                                baseUri={`/things/${id}/relationships`}
                                type1={'thing'}
                            />)}
                        />
                        <Route path={'/things/:id/attachments'}>
                            <EntityAttachmentsView
                                entityId={id}
                                entityType="thing"
                                dataGridId={THING_ATTACHMENTS_DATA_TABLE}
                            />
                        </Route>
                        <Route path={'/things/:id/history'}>
                            <Timeline entityType="thing" entityId={id}/>
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
    isLoading: state.entities.things.details.isLoading,
    thing: get(state.entities.things.details.data, 'thing'),
    lastActionType: state.global.lastActionType,
    lastActionError: state.global.lastActionError,
});

export default connect(
    mapStateToProps,
    { loadThing, openChildrenDrawer: openEntityChildrenDrawer },
)(withRouter(ThingDetail));

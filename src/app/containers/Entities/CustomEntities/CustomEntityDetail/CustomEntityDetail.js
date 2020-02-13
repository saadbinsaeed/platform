// @flow

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import ClassificationsTab from 'app/containers/Common/ClassificationsTab/ClassificationsTab';
import CustomEntityAbout from 'app/containers/Entities/CustomEntities/CustomEntityDetail/CustomEntityAbout';
import CustomEntityChildrenGrid
    from 'app/containers/Entities/CustomEntities/CustomEntityDetail/CustomEntityChildrenGrid';
import CustomEntitySummary from 'app/containers/Entities/CustomEntities/CustomEntityDetail/CustomEntitySummary';
import EntityAttachmentsView from 'app/containers/Entities/Attachments/EntityAttachmentsView';
import Loader from 'app/components/atoms/Loader/Loader';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import PageTemplate from 'app/components/templates/PageTemplate';
import TabItem from 'app/components/molecules/Tabs/TabItem';
import TabRow from 'app/components/molecules/Tabs/TabRow';
import EntityTimeline from 'app/containers/Entities/Timeline/EntityTimeline';
import { CUSTOM_ENTITIES_ATTACHMENTS_DATA_TABLE, CUSTOM_ENTITIES_RELATIONSHIPS_DATA_TABLE } from 'app/config/dataTableIds';
import { formatDate } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { loadCustomEntity, CUSTOM_ENTITY_SAVE } from 'store/actions/entities/customEntitiesActions';
import { openEntityChildrenDrawer } from 'store/actions/entityChildrenDrawer/entityChildrenDrawerActions';
import { stringify } from 'app/utils/utils';
import { UPLOAD_IMAGE } from 'store/actions/entities/entitiesActions';
import RelationshipsTab from 'app/containers/Entities/Relationships/RelationshipsTab';

/**
 * Main container to display the detail of a Custom Entity
 *
 * @example <Custom Entity View />
 */
class CustomEntityDetail extends PureComponent<Object, Object> {
    static propTypes = {
        id: PropTypes.string.isRequired,
        loadCustomEntity: PropTypes.func.isRequired,
        customEntity: PropTypes.object,
        isLoading: PropTypes.bool,
        lastActionError: PropTypes.bool,
        lastActionType: PropTypes.string,
        openChildrenDrawer: PropTypes.func,
    };

    actionTypes: Array<string> = [CUSTOM_ENTITY_SAVE, UPLOAD_IMAGE];

    constructor(props: Object) {
        super(props);
        props.loadCustomEntity(props.id);
    };

    /**
     * @override
     * @param prevProps the properties that the component will receive.
     */
    componentDidUpdate(prevProps) {
        const { lastActionError, lastActionType, id } = this.props;
        if (prevProps.id !== id || (!lastActionError && this.actionTypes.includes(lastActionType))) {
            this.props.loadCustomEntity(id);
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
        const { id, isLoading, customEntity } = this.props;
        if (!isLoading && !customEntity) {
            return <PageNotAllowed title={`Custom Entity (ID:${id})`}/>;
        }

        const createdBy = `${stringify(get(customEntity, 'createdBy.name')) || ''} on ${formatDate(get(
            customEntity,
            'createdDate',
        ))}`;
        const modified = formatDate(get(customEntity, 'modifiedDate'));
        const status = get(customEntity, 'active') ? 'Active' : 'Inactive';
        const infoArray = this.buildInfo(createdBy, modified, status);
        return (
            <Fragment>
                {isLoading && <Loader absolute backdrop/>}
                {customEntity && (
                    <PageTemplate
                        title={customEntity.name}
                        subTitle={`#${customEntity.id}`}
                        info={infoArray}
                        actions={<ButtonIcon
                            icon="sitemap"
                            title="Open Children"
                            onClick={this.props.openChildrenDrawer}
                        />}
                        overflowHidden
                    >
                        <TabRow>
                            <TabItem label="Summary" to={`/custom-entities/${id}/summary`}/>
                            <TabItem label="About" to={`/custom-entities/${id}/about`}/>
                            <TabItem label="Classifications" to={`/custom-entities/${id}/classifications`}/>
                            <TabItem label="Children" to={`/custom-entities/${id}/children`}/>
                            <TabItem label="Relationships" to={`/custom-entities/${id}/relationships`}/>
                            <TabItem label="Attachments" to={`/custom-entities/${id}/attachments`}/>
                            <TabItem label="History" to={`/custom-entities/${id}/history`}/>
                        </TabRow>
                        <Switch>
                            <Route
                                path={`/custom-entities/:id`}
                                exact
                                component={() => <Redirect to={`/custom-entities/${id}/summary`}/>}
                            />
                            <Route path={'/custom-entities/:id/summary'} component={CustomEntitySummary}/>
                            <Route path={'/custom-entities/:id/about'} component={CustomEntityAbout}/>
                            <Route path={'/custom-entities/:id/classifications'}>
                                <ClassificationsTab type="custom"/>
                            </Route>
                            <Route path={'/custom-entities/:id/children'} component={CustomEntityChildrenGrid}/>
                            <Route
                                path={'/custom-entities/:id/relationships'}
                                exact
                                component={() => <Redirect to={`/custom-entities/${id}/relationships/thing`}/>}
                            />
                            <Route
                                path={'/custom-entities/:entityId/relationships/:type2'}
                                render={({ match: { params } }) => (<RelationshipsTab
                                    {...params}
                                    dataTableId={CUSTOM_ENTITIES_RELATIONSHIPS_DATA_TABLE}
                                    baseUri={`/custom-entities/${id}/relationships`}
                                    type1={'custom'}
                                />)}
                            />
                            <Route path={'/custom-entities/:id/attachments'}>
                                <EntityAttachmentsView
                                    entityId={id}
                                    entityType="custom"
                                    dataGridId={CUSTOM_ENTITIES_ATTACHMENTS_DATA_TABLE}
                                />
                            </Route>
                            <Route path={'/custom-entities/:id/history'}>
                                <EntityTimeline entityType="custom" entityId={id}/>
                            </Route>
                        </Switch>
                    </PageTemplate>
                )}
            </Fragment>
        );
    }
}

const mapStateToProps = (state: Object, ownProps: Object) => ({
    id: ownProps.match.params.id,
    userProfile: state.user.profile,
    isLoading: state.entities.customEntities.details.isLoading,
    customEntity: get(state.entities.customEntities.details.data, 'customEntity'),
    lastActionType: state.global.lastActionType,
    lastActionError: state.global.lastActionError,
});

export default connect(
    mapStateToProps,
    { loadCustomEntity, openChildrenDrawer: openEntityChildrenDrawer },
)(CustomEntityDetail);

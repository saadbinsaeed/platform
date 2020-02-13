/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import EventActionRenderer from 'app/components/molecules/Grid/Renderers/EventAction/EventActionRenderer';
import SeverityRenderer from 'app/components/molecules/Grid/Renderers/Severity/SeverityRenderer';
import DateDifferenceRenderer from 'app/components/molecules/Grid/Renderers/DateDifference/DateDifferenceRenderer';
import StatusRenderer from 'app/components/molecules/Grid/Renderers/Status/StatusRenderer';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import StreamDataRenderer from 'app/components/molecules/Grid/Renderers/StreamData/StreamDataRenderer';
import PageTemplate from 'app/components/templates/PageTemplate';
import { EVENTS_DATA_TABLE } from 'app/config/dataTableIds';
import { loadEvents, loadVTR, loadTranslationRuleDescription } from 'store/actions/stream/eventsActions';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import RegionMultiSelect from 'app/components/molecules/MultiSelect/RegionMultiSelect';
import TenantMultiSelect from 'app/components/molecules/MultiSelect/TenantMultiSelect';
import GatewayMultiSelect from 'app/components/molecules/MultiSelect/GatewayMultiSelect';
import VendorMultiSelect from 'app/components/molecules/MultiSelect/VendorMultiSelect';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import eventsTranslation from 'app/config/eventsTranslation.json';
import { sortAscending } from 'app/utils/utils';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

const getValuesFromEventsTranslaion = (field) => {
    return Object.values(eventsTranslation)
        .map((map) => {
            // $FlowFixMe
            if (map && map[field]) return map[field];
            return undefined;
        })
        .filter(Boolean)
        .filter((o, i, a) => a.indexOf(o) === i)
        .map(value => ({ label: value, value }));
};

const EventEntityLinkRenderer = ({ data, value }) => {
    if (!value) return null;
    return <Link to={`/things/${data.device.id}/summary`}>{value}</Link>;
};

/**
 * Renders the view to display the Events.
 */
class EventsList extends PureComponent<Object, Object> {

    static propTypes = {
        loadEvents: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        events: PropTypes.array,
        eventsCount: PropTypes.number,
        eventsCountMax: PropTypes.number,
        userProfile: PropTypes.object,
        loadVTR: PropTypes.func.isRequired,
        vtr: PropTypes.array,
        loadTranslationRuleDescription: PropTypes.func.isRequired,
        translationRuleDescription: PropTypes.array,
    };
    refreshTable: ?Function = null;
    gridSettings = {};

    /**
     *
     */
    constructor(props: Object) {
        super(props);
        this.props.loadVTR(); // load vendor, tenant, region info
        this.props.loadTranslationRuleDescription(); // load translated event descriptions
        this.gridSettings = {
            pageSize: 100,
            filters: { status: { value: ['UNA'] } },
            sort: [{ field: 'eventDate', order: -1 }],
            globalFilter: { value: '' },
        };
    }

    @bind
    refresh() {
        this.refreshTable && this.refreshTable();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.vtr !== this.props.vtr) {
            this.refresh();
        }
        if (prevProps.translationRuleDescription !== this.props.translationRuleDescription) {
            this.refresh();
        }
    }

    @bind
    @memoize()
    normalizeTranslationRule(data: ?Array<Object>) {
        return (data || []).filter(({ translation }) => translation).map(({ translation }) => ({ label: translation, value: translation }));
    }

    @bind
    @memoize()
    buildColumnDefinitions(userProfile, vtr, translationRuleDescriptions) {
        const permissions = new Set(userProfile.permissions || []);
        const isAdmin = userProfile.isAdmin;
        const canEdit = isAdmin || permissions.has('mistream.events.edit');
        const translatedEventDescriptions = this.normalizeTranslationRule(translationRuleDescriptions);
        const columns = [
            {
                field: '_fake_field_action_',
                header: 'Action',
                exportable: false,
                bodyComponent: EventActionRenderer,
                bodyComponentProps: { color: 'white', canEdit, refresh: this.refresh },
                filter: false,
                sortable: false,
                style: { textAlign: 'center', width: '200px' },
            },
            { field: 'device.thingId', header: 'Entity ID', style: { width: '160px' } },
            {
                field: 'device.name',
                header: 'Entity Name',
                bodyComponent: EventEntityLinkRenderer,
                style: { width: '200px' },
            },
        ];
        const isVTR = Array.isArray(vtr);
        const vendor = vtr && vtr.find(cls => cls.uri === 'UMS/Vendor');
        if (!isVTR || vendor) {
            columns.push({
                field: 'device.attributes.Sites/vendor',
                header: 'Vendor',
                filterMatchMode: '=',
                selectFilterComponent: VendorMultiSelect,
                style: { width: '160px' },
            });
        }
        const region = vtr && vtr.find(cls => cls.uri === 'region');
        if (!isVTR || region) {
            columns.push({
                field: 'device.attributes.Sites/region',
                header: 'Region',
                filterMatchMode: '=',
                selectFilterComponent: RegionMultiSelect,
                style: { width: '160px' },
            });
        }
        const tenant = vtr && vtr.find(cls => cls.uri === 'UMS/Tenant');
        if (!isVTR || tenant) {
            columns.push({
                field: 'device.attributes.Sites/tenants',
                header: 'Tenants',
                filterMatchMode: '=',
                selectFilterComponent: TenantMultiSelect,
                style: { width: '160px' },
            });
        }
        columns.push(...[
            {
                field: 'dataPayload.impact',
                header: 'Translated Event Impact',
                filterMatchMode: '=',
                options: sortAscending(getValuesFromEventsTranslaion('impact'), 'label'),
                style: { width: '200px' },
            },
            {
                field: 'status',
                header: 'Event Status',
                filterMatchMode: '=',
                options: ['ACK', 'CLE', 'DIS', 'DUP', 'ERR', 'PRO', 'UNA'].map(value => ({ label: value, value })),
                bodyComponent: StatusRenderer,
                style: { textAlign: 'center', width: '120px' },
            },
            {
                field: 'severity',
                header: 'Translated Event Severity',
                type: 'number',
                options: [0, 1, 2, 3, 4].map(value => ({ label: String(value), value })),
                bodyComponent: SeverityRenderer,
                style: { textAlign: 'center', width: '200px' },
            },
            {
                field: 'dataPayload.type',
                header: 'Translated Event Type',
                filterMatchMode: '=',
                renderValue: ({ value }) => value ? value : '',
                options: sortAscending(getValuesFromEventsTranslaion('type'), 'label'),
                style: { textAlign: 'center', width: '200px' },
            },
            {
                field: 'description',
                header: 'Translated Event Description',
                filterMatchMode: '=',
                options: translatedEventDescriptions,
                style: { width: '320px' },
            },
            { field: 'eventDate', header: 'EPET', type: 'date' },
            {
                field: '__alarmDuration__',
                header: 'Alarm Duration',
                filter: false,
                sortable: false,
                bodyComponent: ({ data }) => <DateDifferenceRenderer value={data && data.receivedDate} />,
                renderValue: ({ data }) => DateDifferenceRenderer({ value: data && data.receivedDate, textOnly: true }),
                style: { width: '320px' },
            },
            { field: 'eventSource.name', header: 'IOT Gateway Name', selectFilterComponent: GatewayMultiSelect, style: { width: '160px' } },
            { field: 'alarmCode', header: 'Original IOT Device Signal Code', style: { width: '260px' } },
            {
                field: 'displayPayload',
                header: 'IOT Gateway Original Signal Data',
                bodyComponent: StreamDataRenderer,
                renderValue: ({ data, value }) => StreamDataRenderer({ data, value, textOnly: true }),
                style: { width: '700px' },
                filter: false,
                sortable: false,
            },
            { field: 'id', header: 'Event ID', type: 'number', style: { width: '100px' } },
            { field: 'streamReceivedDate', header: 'Mi-Stream Time', type: 'date' },

            { field: 'receivedDate', header: 'Affectli Event Time', type: 'date' },
            { field: 'device.description', header: 'Entity Description', style: { width: '200px' } },

            { field: 'modifiedDate', header: 'Modified Date', type: 'date' },
            {
                field: 'updatedBy.name',
                header: 'Modified By',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: { idProperty: 'updatedBy.id', imageProperty: 'updatedBy.image', nameProperty: 'updatedBy.name' },
            },
            { field: 'sourceDevice', header: 'Device Serial No.', style: { width: '160px' } },
            { field: 'device.modifiedDate', type: 'date', header: 'Last Comms From Device', style: { width: '240px' } },
            { field: 'streamId', type: 'uuid', header: 'Stream ID', style: { width: '160px' } },
            {
                field: 'device.active',
                header: 'Related IOT Entity Status',
                type: 'boolean',
                bodyComponent: BooleanRenderer,
                sortable: false,
                renderValue: ({ value }) => value ? 'Active' : 'Inactive',
                options: [{ label: 'All', value: '' }, { label: 'Active', value: true }, { label: 'Inactive', value: false }],
                style: { width: '200px' },
            },
            { field: 'device.id', header: 'Related IOT Entity ID', type: 'number', style: { width: '200px' } },

            {
                field: '__fake__device__name',
                header: 'Related IOT Entity Name',
                bodyComponent: ({ data }) => <EventEntityLinkRenderer data={data} value={data && data.device && data.device.name} />,
                renderValue: ({ data }) => data && data.device && data.device.name,
                filter: false,
                sortable: false,
                style: { width: '250px' },
            },
            {
                field: '__fake_device_description',
                header: 'Related IOT Entity description',
                renderValue: ({ data }) => data && data.device && data.device.description,
                filter: false,
                sortable: false,
                style: { width: '200px' },
            },
            {
                header: 'Device Found',
                field: 'deviceFound',
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => (value ? 'Found' : 'Not Found'),
                options: [{ label: 'All', value: '' }, { label: 'Found', value: true }, { label: 'Not Found', value: false }],
                style: { width: '150px' },
                sortable: false,
                type: 'boolean',
            },
            { field: 'eventType.id', header: 'Event Type', style: { width: '160px' } },
        ]);
        return columns;
    }

    /**
     * @override
     */
    render(): Object {
        const { isLoading, isDownloading, events, eventsCount, eventsCountMax, userProfile, vtr, translationRuleDescription } = this.props;
        return (
            <PageTemplate title="Events Monitor">
                <ContentArea>
                    <DataTable
                        refreshRef={(refresh) => {
                            this.refreshTable = refresh;
                        }}
                        dataTableId={EVENTS_DATA_TABLE}
                        savePreferences={true}
                        gridSettings={this.gridSettings}
                        columnDefinitions={this.buildColumnDefinitions(userProfile, vtr, translationRuleDescription)}
                        loadRows={this.props.loadEvents}
                        isLoading={isLoading}
                        isDownloading={isDownloading}
                        disableGlobalFilter
                        name="events_monitor"
                        value={events}
                        totalRecords={eventsCount}
                        countMax={eventsCountMax}
                        dataKey="id"
                        selectionMode="multiple"
                    />
                </ContentArea>
            </PageTemplate>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.stream.events.list.isLoading || state.stream.vtr.isLoading || state.stream.translationRule.description.isLoading,
        isDownloading: state.stream.events.list.isDownloading,
        events: state.stream.events.list.records,
        eventsCount: state.stream.events.list.count,
        eventsCountMax: state.stream.events.list.countMax,
        userProfile: state.user.profile,
        vtr: state.stream.vtr.data,
        translationRuleDescription: state.stream.translationRule.description.data,
    }),
    {
        loadEvents,
        loadVTR,
        loadTranslationRuleDescription,
    }
)(EventsList);

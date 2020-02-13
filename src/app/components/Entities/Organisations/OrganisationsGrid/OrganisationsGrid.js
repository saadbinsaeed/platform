/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import OrganisationAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/OrganisationAvatarRenderer';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import LocationRenderer from 'app/components/molecules/Grid/Renderers/Location/LocationRenderer';
import LocationValue from 'app/components/molecules/Grid/Renderers/Location/LocationValue';
import LabelListRenderer from 'app/components/molecules/Grid/Renderers/LabelListRenderer/LabelListRenderer';
import PageTemplate from 'app/components/templates/PageTemplate';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import OrganisationsLink from 'app/components/atoms/Link/OrganisationsLink';
import { ORGANISATIONS_DATA_TABLE } from 'app/config/dataTableIds';
import { loadOrganisationsList } from 'store/actions/entities/organisationsActions';
import { loadClassificationsDropDownForGrid } from 'store/actions/grid/gridActions';
import AttachmentLinkRenderer from 'app/components/molecules/Grid/Renderers/Link/AttachmentLinkRenderer';
import RelationshipLinkRenderer from 'app/components/molecules/Grid/Renderers/Link/RelationshipLinkRenderer';
import ClassificationsRenderer
    from 'app/components/molecules/Grid/Renderers/ClassificationsRenderer/ClassificationsRenderer';
import { get } from 'app/utils/lo/lo';
import { cut } from 'app/utils/string/string-utils';

/**
 * Component that is used to display the grid in the Organisations Manager
 *
 * @example <OrganisationsGrid />
 */
class OrganisationsGrid extends Component<Object, Object> {
    /**
     * @const propTypes - describes the properties of the component
     * @const defaultProps - define the defaults values of the properties
     * @const columnDefs -definition for columns that we need to display in our grid
     */
    static propTypes = {
        loadOrganisationsList: PropTypes.func,
        isLoading: PropTypes.bool.isRequired,
        records: PropTypes.array,
        classifications: PropTypes.array,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
        loadClassificationsDropDownForGrid: PropTypes.func.isRequired,
        classificationsLoading: PropTypes.bool,
    };

    static defaultProps = {
        isLoading: true,
    };

    gridSettings = {
        pageSize: 10,
        filters: {},
        sort: [],
        globalFilter: { value: '' },
    };

    /**
     * componentDidMount - description
     *
     * @return {type}  description
     */
    componentDidMount() {
        this.props.loadClassificationsDropDownForGrid({
            filterBy: [
                { field: 'active', op: '=', value: true },
                { field: 'applicableOn', op: '=', value: 'organisation' },
            ],
        });
    }

    /**
     *
     */
    buildColumnDefinitions = memoize((classifications) => {
        return [
            {
                header: 'Name',
                field: 'name',
                bodyComponent: OrganisationAvatarRenderer,
                bodyComponentProps: { idProperty: 'id', imageProperty: 'image', nameProperty: 'name' },
            },
            {
                header: 'Description',
                field: 'description',
                style: { width: '220px' },
                renderValue: ({ data }) => cut(String(get(data, 'description') || ''), 25),
            },
            {
                header: 'Id',
                field: 'id',
                type: 'number',
                bodyComponent: ({ value }) => value ? <OrganisationsLink id={value}>{value}</OrganisationsLink> : '',
                style: { width: '100px' },
            },
            {
                header: 'Classifications',
                field: 'classes.uri',
                filterMatchMode: '=',
                sortable: false,
                bodyComponent: props => <ClassificationsRenderer {...props} valueField="classes"
                    label={'name'}
                    redirectTo={'organisation'}
                />,
                options: (classifications || []).map(({ name, uri }) => ({ value: uri, label: name })),
                renderValue: ({ data }) => data && (data.classes || []).map(({ name }) => name).join(', '),
                style: { width: '360px' },
            },
            {
                header: 'Parent',
                field: 'parent.name',
                bodyComponent: OrganisationAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'parent.id',
                    imageProperty: 'parent.image',
                    nameProperty: 'parent.name',
                },
            },
            {
                header: 'Children',
                field: 'children.name',
                filterMatchMode: 'startsWith',
                sortable: false,
                bodyComponent: ({ data }) => <LabelListRenderer
                    value={(data && data.children) || []}
                    label={'name'}
                    redirectTo={'organisation'}
                />,
                renderValue: ({ data }) => data && (data.children || []).map(({ name }) => name).join(', '),
                style: { width: '300px' },
            },
            {
                header: 'Location',
                field: 'locationInfo',
                filter: false,
                sortable: false,
                bodyComponent: LocationRenderer,
                bodyComponentProps: { linkTo: 'organisation' },
                renderValue: LocationValue,
                style: { width: '220px' },
            },
            {
                header: 'Active',
                field: 'active',
                type: 'boolean',
                sortable: false,
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => value ? 'Active' : 'Inactive',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '100px', textAlign: 'center' },
            },
            { header: 'Created Date', field: 'createdDate', type: 'date' },
            { header: 'Last Modified Date', field: 'modifiedDate', type: 'date' },
            {
                header: 'Created by',
                field: 'createdBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'createdBy.id',
                    imageProperty: 'createdBy.image',
                    nameProperty: 'createdBy.name',
                },
            },
            {
                header: 'Modified by',
                field: 'modifiedBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'modifiedBy.id',
                    imageProperty: 'modifiedBy.image',
                    nameProperty: 'modifiedBy.name',
                },
            },
            {
                header: 'Relationships',
                field: '_relationshipsCount',
                filter: false,
                sortable: false,
                bodyComponent: props => <RelationshipLinkRenderer {...props} redirectTo={'organisation'}/>,
                style: { width: '120px', textAlign: 'center' },
            },
            {
                header: 'Attachments',
                field: '_attachmentsCount',
                filter: false,
                sortable: false,
                bodyComponent: props => <AttachmentLinkRenderer {...props} redirectTo={'organisation'}/>,
                style: { width: '120px', textAlign: 'center' },
            },

        ];
    });

    /**
     * @override
     */
    render(): Object {
        const { classifications, classificationsLoading } = this.props;
        return (
            <PageTemplate title="Organisations">
                <ContentArea>
                    <DataTable
                        dataTableId={ORGANISATIONS_DATA_TABLE}
                        savePreferences={true}
                        gridSettings={this.gridSettings}
                        columnDefinitions={this.buildColumnDefinitions(classifications)}
                        loadRows={this.props.loadOrganisationsList}
                        isLoading={this.props.isLoading || classificationsLoading}
                        disableCountdown={true}
                        name="organisation_list"
                        value={this.props.records}
                        totalRecords={this.props.recordsCount}
                        countMax={this.props.recordsCountMax}
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
        classificationsLoading: state.grid.dropdowns.classifications.isLoading,
        classifications: state.grid.dropdowns.classifications.records,
        isLoading: state.entities.organisations.list.isLoading,
        records: state.entities.organisations.list.records,
        recordsCount: state.entities.organisations.list.count,
        recordsCountMax: state.entities.organisations.list.countMax,
    }),
    {
        loadOrganisationsList,
        loadClassificationsDropDownForGrid,
    },
)(OrganisationsGrid);

/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { Link } from 'react-router-dom';
import { loadClassificationsDropDownForGrid } from 'store/actions/grid/gridActions';
import PageTemplate from 'app/components/templates/PageTemplate';
import { loadCustomEntities } from 'store/actions/entities/customEntitiesActions';
import CustomEntityAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/CustomEntityAvatarRenderer';
import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import LocationRenderer from 'app/components/molecules/Grid/Renderers/Location/LocationRenderer';
import LocationValue from 'app/components/molecules/Grid/Renderers/Location/LocationValue';
import LabelListRenderer from 'app/components/molecules/Grid/Renderers/LabelListRenderer/LabelListRenderer';
import ClassificationsRenderer
    from 'app/components/molecules/Grid/Renderers/ClassificationsRenderer/ClassificationsRenderer';
import AttachmentLinkRenderer from 'app/components/molecules/Grid/Renderers/Link/AttachmentLinkRenderer';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import { CUSTOM_ENTITIES_TABLE } from 'app/config/dataTableIds';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import Icon from 'app/components/atoms/Icon/Icon';
import styled from 'styled-components';
import RelationshipLinkRenderer from 'app/components/molecules/Grid/Renderers/Link/RelationshipLinkRenderer';
import { get } from 'app/utils/lo/lo';
import { cut } from 'app/utils/string/string-utils';

const StyledIcon = styled(Icon)`
    color: ${({ color }) => color || 'white'};
`;

/**
 * Renders the view to display the custom entities grid.
 */
class CustomEntitesList extends PureComponent<Object, Object> {
    static propTypes = {
        loadCustomEntities: PropTypes.func.isRequired,
        loadClassificationsDropDownForGrid: PropTypes.func.isRequired,
        classifications: PropTypes.array,
        classificationsLoading: PropTypes.bool,
        customEntities: PropTypes.array,
        isLoading: PropTypes.bool,
        count: PropTypes.number,
        countMax: PropTypes.number,
    };

    gridSettings = {
        sort: [{ field: 'modifiedDate', direction: 'desc' }, { field: 'createdDate', direction: 'desc' }],
        globalFilter: { value: '' },
    };

    /**
     *
     */
    constructor(props: Object) {
        super(props);
        this.props.loadClassificationsDropDownForGrid({
            filterBy: [
                { field: 'active', op: '=', value: true },
                { field: 'applicableOn', op: '=', value: 'custom' },
            ],
        });
    }

    /**
     *
     */
    buildColumnDefinitions = memoize((classifications) => {
        return [
            {
                header: 'Entity Name',
                field: 'name',
                bodyComponent: CustomEntityAvatarRenderer,
                imageProperty: 'image',
                nameProperty: 'name',
            },
            {
                header: 'Description',
                field: 'description',
                style: { width: '220px' },
                renderValue: ({ data }) => cut(String(get(data, 'description') || ''), 25),
            },
            {
                header: 'Entity ID',
                field: 'id',
                type: 'number',
                bodyComponent: ({ value }) => <Link to={`/custom-entities/${value}`}>{value}</Link>,
                style: { width: '100px' },
            },
            {
                header: 'Classifications',
                field: 'classes.uri',
                filterMatchMode: '=',
                sortable: false,
                bodyComponent: props => <ClassificationsRenderer {...props} valueField="classes"
                    label={'name'}
                    redirectTo={'custom'}
                />,
                renderValue: ({ data }) => data && (data.classes || []).map(({ name }) => name).join(', '),
                options: (classifications || []).map(({ name, uri }) => ({ value: uri, label: name })),
                style: { width: '360px' },
            },
            {
                header: 'Entity Parent',
                field: 'parent.name',
                bodyComponent: CustomEntityAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'parent.id',
                    imageProperty: 'parent.image',
                    nameProperty: 'parent.name',
                },
                style: { width: '200px' },
            },
            {
                header: `Children`,
                field: 'children.name',
                filterMatchMode: 'startsWith',
                sortable: false,
                bodyComponent: ({ data }) => <LabelListRenderer
                    value={(data && data.children) || []}
                    label={'name'}
                    redirectTo={'custom'}
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
                bodyComponentProps: { linkTo: 'custom' },
                renderValue: LocationValue,
                style: { width: '220px' },
            },
            {
                header: 'Icon',
                field: 'iconName',
                bodyComponent: ({ data, value }) => value &&
                    <StyledIcon title={value} name={value} color={data && data.iconColor}/>,
                filter: false,
                sortable: false,
                style: { width: '100px', textAlign: 'center' },
            },
            {
                header: 'Active',
                field: 'active',
                type: 'boolean',
                sortable: false,
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => (value ? 'Active' : 'Inactive'),
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '150px', textAlign: 'center' },
            },
            {
                header: 'Attachments',
                field: '_attachmentsCount',
                filter: false,
                sortable: false,
                bodyComponent: props => <AttachmentLinkRenderer {...props} redirectTo={'custom'}/>,
                style: { width: '100px', textAlign: 'center' },
            },
            {
                header: 'Relationships',
                field: '_relationshipsCount',
                filter: false,
                sortable: false,
                bodyComponent: props => <RelationshipLinkRenderer {...props} redirectTo={'custom'}/>,
                style: { width: '100px', textAlign: 'center' },
            },
            { header: 'Last Modified Date', field: 'modifiedDate', type: 'date' },
            {
                header: 'Modified By',
                field: 'modifiedBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'modifiedBy.id',
                    imageProperty: 'modifiedBy.image',
                    nameProperty: 'modifiedBy.name',
                },
            },
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
            { header: 'Created Date', field: 'createdDate', type: 'date' },
        ];
    });

    /**
     * @override
     */
    render() {
        const { classificationsLoading, isLoading, isDownloading, loadCustomEntities, customEntities, count, countMax, classifications } = this.props;
        const { gridSettings } = this;
        return (
            <PageTemplate title="Custom Entities">
                <ContentArea>
                    <DataTable
                        dataTableId={CUSTOM_ENTITIES_TABLE}
                        savePreferences={true}
                        gridSettings={gridSettings}
                        columnDefinitions={this.buildColumnDefinitions(classifications)}
                        loadRows={loadCustomEntities}
                        isLoading={isLoading || classificationsLoading}
                        isDownloading={isDownloading}
                        disableCountdown={true}
                        name="custom_entities_list"
                        value={customEntities}
                        totalRecords={count}
                        countMax={countMax}
                        dataKey="id"
                        selectionMode="multiple"
                    />
                </ContentArea>
            </PageTemplate>
        );
    }
}

const mapStateToProps = (state: Object) => ({
    classificationsLoading: state.grid.dropdowns.classifications.isLoading,
    classifications: state.grid.dropdowns.classifications.records,
    customEntities: state.entities.customEntities.list.records,
    count: state.entities.customEntities.list.count,
    countMax: state.entities.customEntities.list.countMax,
    isLoading: state.entities.customEntities.list.isLoading,
    isDownloading: state.entities.customEntities.list.isDownloading,
});

export default connect(
    mapStateToProps,
    {
        loadCustomEntities,
        loadClassificationsDropDownForGrid,
    },
)(CustomEntitesList);

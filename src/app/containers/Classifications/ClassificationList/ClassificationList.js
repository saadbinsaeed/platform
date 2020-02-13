/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import PageTemplate from 'app/components/templates/PageTemplate';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import { CLASSIFICATIONS_DATA_TABLE } from 'app/config/dataTableIds';
import LabelListRenderer from 'app/components/molecules/Grid/Renderers/LabelListRenderer/LabelListRenderer';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { loadClassifications } from 'store/actions/classifications/classificationsActions';
import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import ClassificationAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/ClassificationAvatarRenderer';
import { capitalizeFirstLetter } from 'app/utils/utils';

/**
 * Renders the view to display the classification.
 */
class ClassificationList extends Component<Object, Object> {

    static propTypes = {
        loadClassifications: PropTypes.func.isRequired,
        thingId: PropTypes.string,
        records: PropTypes.array,
        isLoading: PropTypes.bool,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
    };

    columnDefinitions: Object[];

    gridSettings = {
        pageSize: 10,
        filters: {},
        sort: [],
        globalFilter: { value: '' },
    };

    /**
     * @param {Object} props - component's properties
     */
    constructor(props: Object) {
        super(props);

        this.columnDefinitions = [
            {
                header: 'Classification URI',
                field: 'uri',
                bodyComponent: ClassificationAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'id',
                    imageProperty: 'image',
                    nameProperty: 'name',
                },
            },
            {
                header: 'Applies To',
                field: 'applicableOn',
                sortable: false,
                bodyComponent: ({ value, ...rest }) => (
                    <LabelListRenderer {...rest} value={value && value.filter(Boolean).map(v => v === 'custom' ? 'Custom Entity' : capitalizeFirstLetter(v))}/>),
                options: [
                    { label: 'Thing', value: 'thing' },
                    { label: 'Person', value: 'person' },
                    { label: 'Organisation', value: 'organisation' },
                    { label: 'Custom Entity', value: 'custom' },
                    { label: 'Group', value: 'group' },
                    { label: 'Process', value: 'process' },
                    { label: 'Relationship', value: 'relationship' },
                ],
                renderValue: ({ value }) => value && value.filter(Boolean).map(v => v === 'custom' ? 'Custom Entity' : capitalizeFirstLetter(v)).join(','),
                filterMatchMode: '=',
            },
            {
                header: 'Classification Name',
                field: 'name',
                bodyComponent: ClassificationAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'id',
                    imageProperty: 'image',
                    nameProperty: 'name',
                },
            },
            {
                header: 'Active',
                field: 'active',
                sortable: false,
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => value ? 'Active' : 'Inactive',
                type: 'boolean',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '100px', textAlign: 'center' },
            },
            {
                header: 'Abstract',
                field: 'abstract',
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => value ? 'Abstract' : 'Non-abstract',
                type: 'boolean',
                sortable: false,
                options: [
                    { label: 'All', value: '' },
                    { label: 'Abstract', value: true },
                    { label: 'Non-abstract', value: false },
                ],
                style: { width: '150px', textAlign: 'center' },
            },
            { header: 'Modified Date', field: 'modifiedDate', type: 'date' },
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
            { header: 'Created Date', field: 'createdDate', type: 'date' },
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
        ];
    }

    /**
     * @override
     */
    render(): Object {
        const { isLoading, isDownloading, records, recordsCount, recordsCountMax } = this.props;
        return (
            <PageTemplate title="Classification Manager">
                <ContentArea>
                    <DataTable
                        dataTableId={CLASSIFICATIONS_DATA_TABLE}
                        savePreferences={true}
                        columnDefinitions={this.columnDefinitions}
                        isLoading={isLoading}
                        isDownloading={isDownloading}
                        disableCountdown={true}
                        loadRows={this.props.loadClassifications}
                        gridSettings={this.gridSettings}
                        name="classification_list"
                        value={records}
                        totalRecords={recordsCount}
                        countMax={recordsCountMax}
                        dataKey="id"
                        selectionMode="multiple"
                    />
                </ContentArea>
            </PageTemplate>
        );
    }
}

const mapStateToProps = (state: Object) => {
    return {
        records: state.classifications.list.records,
        recordsCount: state.classifications.list.count,
        recordsCountMax: state.classifications.list.countMax,
        isLoading: state.classifications.list.isLoading,
        isDownloading: state.classifications.list.isDownloading,
    };
};

export default withRouter(connect(
    mapStateToProps,
    { loadClassifications },
)(ClassificationList));

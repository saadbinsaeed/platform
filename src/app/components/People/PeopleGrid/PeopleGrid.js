/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import LocationRenderer from 'app/components/molecules/Grid/Renderers/Location/LocationRenderer';
import LocationValue from 'app/components/molecules/Grid/Renderers/Location/LocationValue';
import { PEOPLE_DATA_TABLE } from 'app/config/dataTableIds';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';
import { loadClassificationsDropDownForGrid } from 'store/actions/grid/gridActions';
import { loadPeopleList } from 'store/actions/entities/peopleActions';
import AttachmentLinkRenderer from 'app/components/molecules/Grid/Renderers/Link/AttachmentLinkRenderer';
import ClassificationsRenderer
    from 'app/components/molecules/Grid/Renderers/ClassificationsRenderer/ClassificationsRenderer';
import RelationshipLinkRenderer from 'app/components/molecules/Grid/Renderers/Link/RelationshipLinkRenderer';

/**
 * Component that is used to display the grid in the People Manager
 *
 * @example <PeopleGrid />
 */
class PeopleGrid extends PureComponent<Object, Object> {
    /**
     * @const propTypes - describes the properties of the component
     * @const defaultProps - define the defaults values of the properties
     * @const columnDefinitions -definition for columns that we need to display in our grid
     */
    static propTypes = {
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        recordsCount: PropTypes.number,
        recordsCountMax: PropTypes.number,
        loadData: PropTypes.func.isRequired,
        classifications: PropTypes.array,
        loadClassificationsDropDownForGrid: PropTypes.func.isRequired,
        classificationsLoading: PropTypes.bool,
    };

    static defaultProps = {
        isLoading: false,
    };

    columnDefinitions: Array<Object>;

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
                { field: 'applicableOn', op: '=', value: 'person' },
            ],
        });
    }

    /**
     *
     */
    buildColumnDefinitions = () => {
        const { classifications } = this.props;
        return [
            { header: 'Name', field: 'name', bodyComponent: PersonAvatarRenderer },
            {
                header: 'Id',
                field: 'id',
                type: 'number',
                bodyComponent: ({ value }) => value ? <PeopleLink id={value}>{value}</PeopleLink> : '',
                style: { width: '100px' },
            },
            {
                header: 'Classifications',
                field: 'classes.uri',
                sortable: false,
                bodyComponent: props => <ClassificationsRenderer {...props} valueField="classes"
                    label={'name'}
                    redirectTo={'person'}
                />,
                renderValue: ({ data }) => data && (data.classes || []).map(({ name }) => name).join(', '),
                filterMatchMode: '=',
                options: (classifications || []).map(({ name, uri }) => ({ value: uri, label: name })),
                style: { width: '360px' },
            },
            {
                header: 'Location',
                field: 'locationInfo',
                filter: false,
                sortable: false,
                bodyComponent: LocationRenderer,
                renderValue: LocationValue,
                bodyComponentProps: { linkTo: 'person' },
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
            { header: 'Last Modified', field: 'modifiedDate', type: 'date' },
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
                header: 'Attachments',
                field: '_attachmentsCount',
                filter: false,
                sortable: false,
                bodyComponent: props => <AttachmentLinkRenderer {...props} redirectTo={'person'}/>,
                style: { width: '120px', textAlign: 'center' },
            },
            {
                header: 'Relationships',
                field: '_relationshipsCount',
                filter: false,
                sortable: false,
                bodyComponent: props => <RelationshipLinkRenderer {...props} redirectTo={'person'}/>,
                style: { width: '120px', textAlign: 'center' },
            },
        ];
    };

    /**
     * @override
     */
    render(): Object {
        const { isLoading, isDownloading, classificationsLoading, loadData, records, recordsCount, recordsCountMax } = this.props;
        return (
            <DataTable
                dataTableId={PEOPLE_DATA_TABLE}
                savePreferences={true}
                gridSettings={this.gridSettings}
                columnDefinitions={this.buildColumnDefinitions()}
                loadRows={loadData}
                isLoading={isLoading || classificationsLoading}
                isDownloading={isDownloading}
                disableCountdown={true}
                name="people_list"
                value={records}
                totalRecords={recordsCount}
                countMax={recordsCountMax}
                dataKey="id"
                selectionMode="multiple"
            />
        );
    }
}

export default connect(
    (state: Object): Object => ({
        classificationsLoading: state.grid.dropdowns.classifications.isLoading,
        classifications: state.grid.dropdowns.classifications.records,
        isLoading: state.entities.people.list.isLoading,
        isDownloading: state.entities.people.list.isDownloading,
        records: state.entities.people.list.records,
        recordsCount: state.entities.people.list.count,
        recordsCountMax: state.entities.people.list.countMax,
    }),
    {
        loadData: loadPeopleList,
        loadClassificationsDropDownForGrid,
    },
)(PeopleGrid);

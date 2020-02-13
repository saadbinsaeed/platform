/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadClassificationsDropDownForGrid } from 'store/actions/grid/gridActions';
import { ORGANISATION_CHILDREN_DATA_TABLE } from 'app/config/dataTableIds';
import LabelListRenderer from 'app/components/molecules/Grid/Renderers/LabelListRenderer/LabelListRenderer';
import TreeDataTable from 'app/components/molecules/DataTable/DataTableClient/TreeDataTable';
import { loadOrganisationChildren } from 'store/actions/entities/organisationsActions';
import Immutable from 'app/utils/immutable/Immutable';
import { formatDate } from 'app/utils/date/date';
import styled from 'styled-components';
import Icon from 'app/components/atoms/Icon/Icon';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import OrganisationsLink from 'app/components/atoms/Link/OrganisationsLink';
import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';

const StyledIcon = styled(Icon)`
    color: ${({ color }) => color || 'white'};
`;

/**
 * Shows the Organisation Children grid view.
 */
class OrganisationChildrenGrid extends Component<Object, Object> {
    static propTypes = {
        id: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        loadOrganisationChildren: PropTypes.func.isRequired,
        children: PropTypes.array,
    };

    columnDefs: Object[];

    loadParams: Object;

    state = {
        list: [],
    };

    gridSettings = {
        pageSize: 10,
        filters: {},
        sort: [],
        globalFilter: { value: '' },
    };

    buildColumnDefinitions = () => {
        return [
            {
                header: 'Organisation Name',
                field: 'name',
                sortable: false,
                bodyComponent: ({ data, value }) => value
                    ? <OrganisationsLink id={data.id}>{value}</OrganisationsLink>
                    : '',
            },
            {
                header: 'Organisation ID',
                field: 'id',
                type: 'number',
                sortable: false,
                bodyComponent: ({ value }) => value ? <OrganisationsLink id={value}>{value}</OrganisationsLink> : '',
                style: { width: '150px' },
            },
            {
                header: 'Icon',
                field: 'iconName',
                bodyComponent: ({ data, value }) => value ? <StyledIcon
                    title={value}
                    name={value}
                    color={data && data.iconColor}
                /> : '',
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
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                ],
                style: { width: '180px', textAlign: 'center' },
            },
            {
                header: 'Classifications',
                field: 'classesUris',
                sortable: false,
                bodyComponent: ({ data }) => <LabelListRenderer
                    data={data}
                    value={data.classes}
                    label="name"
                    redirectTo={'entity'}
                />,
                style: { width: '300px' },
                options: (this.props.classifications || []).map(({ uri, name }) => ({ value: uri, label: name })),
            },
            {
                header: 'Added By',
                field: 'createdBy.name',
                sortable: false,
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: { idProperty: 'createdBy.id', imageProperty: 'createdBy.image', nameProperty: 'createdBy.name' },
            },
            {
                header: 'Date Added',
                field: 'createdDate',
                type: 'date',
                sortable: false,
                bodyComponent: ({ value }) => formatDate(value),
            },
            {
                header: 'Modified By',
                field: 'modifiedBy.name',
                bodyComponent: PersonAvatarRenderer,
                sortable: false,
                bodyComponentProps: { idProperty: 'modifiedBy.id', imageProperty: 'modifiedBy.image', nameProperty: 'modifiedBy.name' },
            },
            {
                header: 'Date Modified',
                field: 'modifiedDate',
                type: 'date',
                sortable: false,
                bodyComponent: ({ value }) => formatDate(value),
            },
        ];
    };

    /**
     * @override
     */
    componentDidMount() {
        this.props.loadClassificationsDropDownForGrid({
            filterBy: [
                { field: 'active', op: '=', value: true },
                { field: 'applicableOn', op: '=', value: 'organisation' },
            ],
        });
        this.props.loadOrganisationChildren(this.props.id);
    }

    /**
     * @override
     */
    componentDidUpdate(prevProps: Object) {
        const children = this.props.children || [];
        if (prevProps.children !== children) {
            const { id } = this.props;
            if (children.length && children[0].parent.id) {
                if (children[0].parent.id === Number(id)) {
                    this.setState({
                        list: Immutable(this.buildFlatList(children, id, [])),
                    });
                } else {
                    this.setState({
                        list: Immutable(this.buildFlatList(children, children[0].parent.id, [...this.state.list])),
                    });
                }
            }
        }
    }

    /**
     *
     */
    buildFlatList(records, parentId, accumulator = []) {
        accumulator.push(
            ...records.map(record => ({
                ...record,
                children: undefined,
                parentId,
                classesUris: (record.classes || []).map(cl => cl.uri).join(','),
                createdByName: record.createdBy && record.createdBy.name,
                modifiedByName: record.modifiedBy && record.modifiedBy.name,
            })),
        );
        records.filter(record => record.children)
            .forEach(record => this.buildFlatList(record.children, record.id, accumulator));
        return accumulator;
    }

    /**
     * Loads the nephews of the node with the specified id (if any)
     */
    loadChildren = (id) => {
        this.props.loadOrganisationChildren(id);
    };

    /**
     * @override
     */
    render(): Object {
        const { isLoading, classificationsLoading } = this.props;
        const { list } = this.state;
        const { gridSettings } = this;

        return (
            <TreeDataTable
                dataTableId={ORGANISATION_CHILDREN_DATA_TABLE}
                savePreferences={true}
                disableExport={true}
                gridSettings={gridSettings}
                columnDefinitions={this.buildColumnDefinitions()}
                isLoading={isLoading || classificationsLoading}
                data={list}
                selectionMode="single"
                dataKey="id"
                metaKeySelection={false}
                loadChildren={this.loadChildren}
                disableExpandAll
            />
        );
    }
}

export default connect(
    state => ({
        children: state.entities.organisations.children.data,
        isLoading: state.entities.organisations.children.isLoading,
        classificationsLoading: state.grid.dropdowns.classifications.isLoading,
        classifications: state.grid.dropdowns.classifications.records,
    }),
    { loadOrganisationChildren, loadClassificationsDropDownForGrid },
)(OrganisationChildrenGrid);
